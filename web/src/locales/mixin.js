export default {
  methods: {
    onChangeLocale (command) {
      this.$i18n.locale = command
      const titles = {
        fr: 'Langue modifiée',
        en: 'Language changed'
      }
      const messages = {
        fr: `Langue actuelle : ${this.$t('_name')} [ ${this.$i18n.locale} ]`,
        en: `Current language: ${this.$t('_name')} [ ${this.$i18n.locale} ]`
      }
      this.$notify({
        title: titles[command] || 'Langue / Language',
        dangerouslyUseHTMLString: true,
        message: messages[command] || `Current: ${this.$t('_name')}`
      })
    }
  }
}
