# -*- coding: utf-8 -*-

"""
@author: Yuan Xiaotian
@contact: QQ:1638245306
@Created on: 2021/5/31 031 22:08
@Remark: Classe de modèle de base publique
"""
import uuid
from datetime import date, timedelta

from django.apps import apps
from django.db import models, transaction, connection, ProgrammingError
from django.core.exceptions import ObjectDoesNotExist

from application import settings
from application.dispatch import is_tenants_mode

table_prefix = settings.TABLE_PREFIX  # Préfixe des noms de tables de la base de données


class SoftDeleteQuerySet(models.query.QuerySet):
    @transaction.atomic
    def delete(self, cascade=True):
        if cascade:  # delete one by one if cascade
            for obj in self.all():
                obj.delete(cascade=cascade)
        return self.update(is_deleted=True)

    def hard_delete(self):
        return super().delete()


class SoftDeleteManager(models.Manager):
    """Prend en charge la suppression logicielle"""

    def __init__(self, *args, **kwargs):
        self.__add_is_del_filter = False
        super(SoftDeleteManager, self).__init__(*args, **kwargs)

    def filter(self, *args, **kwargs):
        # Vérifier si is_deleted est transmis activement
        if not kwargs.get("is_deleted") is None:
            self.__add_is_del_filter = kwargs.get("is_deleted")
        return super(SoftDeleteManager, self).filter(*args, **kwargs)

    def get_queryset(self):
        if self.__add_is_del_filter:
            return SoftDeleteQuerySet(self.model, using=self._db).exclude(is_deleted=False)
        return SoftDeleteQuerySet(self.model).exclude(is_deleted=True)

    def get_by_natural_key(self, name):
        return SoftDeleteQuerySet(self.model).get(username=name)


def get_month_range(start_day, end_day):
    months = (end_day.year - start_day.year) * 12 + end_day.month - start_day.month
    month_range = [
        "%s-%s-01" % (start_day.year + mon // 12, str(mon % 12 + 1).zfill(2))
        for mon in range(start_day.month - 1, start_day.month + months)
    ]
    return month_range


class SoftDeleteModel(models.Model):
    """
    Modèle de suppression logicielle
    Une fois hérité, la suppression logicielle est activée
    """

    is_deleted = models.BooleanField(verbose_name="Suppression logicielle", help_text="Suppression logicielle", default=False, db_index=True)
    objects = SoftDeleteManager()

    class Meta:
        abstract = True
        verbose_name = "Modèle de suppression logicielle"
        verbose_name_plural = verbose_name

    @transaction.atomic
    def delete(self, using=None, cascade=True, *args, **kwargs):
        """
        Surcharger la méthode de suppression pour activer directement la suppression logicielle
        """
        self.is_deleted = True
        self.save(using=using)
        if cascade:
            self.delete_related_objects(raise_exception=True)
        # raise Exception("delete_related_objects")

    def hard_delete(self):
        return super().delete()

    soft_delete_kwargs = {
        "related_names": [],
    }

    @classmethod
    def _get_kwargs(cls):
        return cls.soft_delete_kwargs

    @classmethod
    def _get_relations(cls):
        relations = {"foreign": [], "self": []}
        related_fields = cls._get_kwargs().get("related_names", [])
        if not related_fields:
            fields = cls._meta.get_fields(include_hidden=True)
            mutated_fields = [field for field in fields if field.is_relation and hasattr(field, "related_name")]
            m2m_models = [field.through for field in mutated_fields if field.many_to_many]
            related_fields = [
                field.related_name
                for field in mutated_fields
                if not field.many_to_many and field.related_model not in m2m_models and field.related_name
            ]
            tree_model_field = [
                field.field.name
                for field in mutated_fields
                if not field.many_to_many and field.related_model is field.model
            ]
            relations["self"] = f"{tree_model_field[0]}_id" if len(tree_model_field) == 1 else None
        relations["foreign"] = related_fields
        return relations

    def _is_cascade(self, relation):
        on_delete_case = self._meta.get_field(relation).on_delete.__name__
        return on_delete_case == "CASCADE"

    def _get_related_objects(self, relation):
        qs = getattr(self, relation)
        if isinstance(qs, models.Manager):
            return qs
        return

    def related_objects(self, raise_exception=False, use_soft_manager=False):
        relations = self._get_relations()
        objects = {}
        for relation in relations["foreign"]:
            try:
                qs = self._get_related_objects(relation)
            except ObjectDoesNotExist as e:
                if raise_exception:
                    raise e
                continue
            else:
                objects[relation] = qs
        if relations["self"]:
            objects["self"] = self.__class__.objects.filter(**{relations["self"]: self.id})
        print(f"related_objects: {objects}", flush=True)
        return objects

    def delete_related_objects(self, raise_exception=False):
        for relation, qs in self.related_objects(raise_exception=raise_exception).items():
            if relation == "self":
                qs.delete()
                continue
            if self._is_cascade(relation):
                print(f"model {self.__class__} : cascade delete {relation} objects {qs.all()}", flush=True)
                qs.all().delete()
            else:
                print(f"model {self.__class__} : protect delete {relation} objects {qs.all()}", flush=True)
                if qs.all().exists():
                    self.hard_delete()
                qs.all().hard_delete()
        # raise Exception("xxxxxxxxxxx for test xxxxxxxxxxx")


class CoreModel(models.Model):
    """
    Modèle abstrait standard de base, utilisable directement par héritage
    Ajoute des champs d'audit ; lors de la surcharge des champs, ne pas modifier les noms, les noms des champs d'audit doivent rester uniformes
    """
    id = models.BigAutoField(primary_key=True, help_text="Id", verbose_name="Id")
    description = models.CharField(max_length=255, verbose_name="Description", null=True, blank=True, help_text="Description")
    creator = models.ForeignKey(to=settings.AUTH_USER_MODEL, related_query_name='creator_query', null=True,
                                verbose_name='Créateur', help_text="Créateur", on_delete=models.SET_NULL,
                                db_constraint=False)
    modifier = models.CharField(max_length=255, null=True, blank=True, help_text="Modificateur", verbose_name="Modificateur")
    dept_belong_id = models.CharField(max_length=255, help_text="Département d'appartenance des données", null=True, blank=True,
                                      verbose_name="Département d'appartenance des données")
    update_datetime = models.DateTimeField(auto_now=True, null=True, blank=True, help_text="Date de modification",
                                           verbose_name="Date de modification")
    create_datetime = models.DateTimeField(auto_now_add=True, null=True, blank=True, help_text="Date de création",
                                           verbose_name="Date de création")

    class Meta:
        abstract = True
        verbose_name = 'Modèle de base'
        verbose_name_plural = verbose_name


class AddPostgresPartitionedBase:
    """
    Classe de base de partitionnement de tables pgsql
    """

    @classmethod
    def add_hash_partition(cls, number=36):
        """
        Créer la table partitionnée
        :return:
        """
        if cls.PartitioningMeta.method != 'hash':
            raise ProgrammingError("Erreur de partitionnement de table, partitionnement impossible")
        schema_editor = connection.schema_editor()
        if is_tenants_mode():
            schema_editor.sql_add_hash_partition = f'CREATE TABLE "{connection.tenant.schema_name}".%s PARTITION OF "{connection.tenant.schema_name}".%s FOR VALUES WITH (MODULUS %s, REMAINDER %s)'
        for item in range(number):
            try:
                schema_editor.add_hash_partition(
                    model=cls,
                    name="_" + str(item),
                    modulus=number,
                    remainder=item,
                )
            except ProgrammingError as e:
                print(f"{cls.__name__}Échec du partitionnement :" + str(e).rstrip('\n'))
        return

    @classmethod
    def add_range_day_partition(cls, day=7):
        """
        Partitionner par "jour" de création
        :return:
        """
        if cls.PartitioningMeta.method != 'range':
            raise ProgrammingError("Erreur de partitionnement de table, partitionnement impossible")
        day_before = date.today().strftime("%Y-%m-%d")
        schema_editor = connection.schema_editor()
        if is_tenants_mode():
            schema_editor.sql_add_range_partition = (
                f'CREATE TABLE "{connection.tenant.schema_name}".%s PARTITION OF "{connection.tenant.schema_name}".%s FOR VALUES FROM (%s) TO (%s)'
            )
        for index in range(day):
            try:
                day_following = (date.today() + timedelta(days=index + 1)).strftime("%Y-%m-%d")
                schema_editor.add_range_partition(
                    model=cls,
                    name=f"{day_before}_{day_following}",
                    from_values=day_before,
                    to_values=day_following,
                )
                day_before = day_following
            except ProgrammingError as e:
                print(f"{cls.__name__}Échec du partitionnement :" + str(e).rstrip('\n'))
        return

    @classmethod
    def add_range_month_partition(cls, start_date, end_date):
        """
        Partitionner par "mois" de création
        :return:
        """
        if cls.PartitioningMeta.method != 'range':
            raise ProgrammingError("Erreur de partitionnement de table, partitionnement impossible")
        range_month_partition_list = get_month_range(start_date, end_date)
        schema_editor = connection.schema_editor()
        if is_tenants_mode():
            schema_editor.sql_add_range_partition = (
                f'CREATE TABLE "{connection.tenant.schema_name}".%s PARTITION OF "{connection.tenant.schema_name}".%s FOR VALUES FROM (%s) TO (%s)'
            )
        for index, ele in enumerate(range_month_partition_list):
            if index == 0:
                continue
            try:
                schema_editor.add_range_partition(
                    model=cls,
                    name=f"{range_month_partition_list[index - 1][:-3]}_{ele[:-3]}",
                    from_values=range_month_partition_list[index - 1],
                    to_values=ele,
                )
            except ProgrammingError as e:
                print(f"{cls.__name__}Échec du partitionnement :" + str(e).rstrip('\n'))
        return

    @classmethod
    def add_list_partition(cls, unique_value):
        """
        Partitionner selon une valeur donnée
        :param unique_value:
        :return:
        """
        if cls.PartitioningMeta.method != 'list':
            raise ProgrammingError("Erreur de partitionnement de table, partitionnement impossible")
        schema_editor = connection.schema_editor()
        if is_tenants_mode():
            schema_editor.sql_add_list_partition = (
                f'CREATE TABLE "{connection.tenant.schema_name}".%s PARTITION OF "{connection.tenant.schema_name}".%s FOR VALUES IN (%s)'
            )
        try:
            schema_editor.add_list_partition(
                model=cls,
                name=f"_{unique_value}",
                values=[unique_value],
            )
        except ProgrammingError as e:
            print(f"{cls.__name__}Échec du partitionnement :" + str(e).rstrip('\n'))
        return


def get_all_models_objects(model_name=None):
    """
    Récupérer tous les objets models
    :return: {}
    """
    settings.ALL_MODELS_OBJECTS = {}
    if not settings.ALL_MODELS_OBJECTS:
        all_models = apps.get_models()
        for item in list(all_models):
            table = {
                "tableName": item._meta.verbose_name,
                "table": item.__name__,
                "tableFields": []
            }
            for field in item._meta.fields:
                fields = {
                    "title": field.verbose_name,
                    "field": field.name
                }
                table['tableFields'].append(fields)
            settings.ALL_MODELS_OBJECTS.setdefault(item.__name__, {"table": table, "object": item})
    if model_name:
        return settings.ALL_MODELS_OBJECTS[model_name] or {}
    return settings.ALL_MODELS_OBJECTS or {}
