<template>
    <Page>
        <ActionBar>
            <Label text="Home"/>
        </ActionBar>

        <StackLayout>
        <TextField v-model="nom" hint="Placeholder..." />
        <TextField v-model="preNom" hint="Placeholder..." />

        <label :text="var1"></label>
        <label :text="var2"></label>
        <label :text="var3"></label>
        <label :text="message"></label>
        <label :text="message2"></label>
        <label text="text hardcoded"></label>
        </StackLayout>
    </Page>
</template>

<script>
  export default {
    data () {
        return {
            var1: "ma varriable1!",
            var2: "ma varriable2!",
            var3: "ma varriable3!",
            nom: "",
            preNom: ""
        }
    },
    computed: {
      message() {
        return "Bonjour " + this.nom + ' ' + this.preNom;
      },
      message2() {
        return "Bonjour2 " + this.nom + ' ' + this.preNom;
      }
    }
  };
</script>

<style scoped lang="scss">
    @import '@nativescript/theme/scss/variables/blue';

    // Custom styles
    .fas {
        @include colorize($color: accent);
    }

    .info {
        font-size: 20;
        horizontal-align: center;
        vertical-align: center;
    }
</style>
