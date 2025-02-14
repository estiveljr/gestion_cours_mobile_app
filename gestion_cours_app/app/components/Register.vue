<template>
    <Page>
        <ActionBar title="Register" />
        <StackLayout>
            <TextField v-model="username" hint="Username" keyboardType="text" />
            <TextField v-model="email" hint="Email" keyboardType="email" />
            <TextField v-model="password" hint="Password" secure="true" />
            <Button text="Register" @tap="register" />
            <Button text="Go Back to Login" @tap="goToLogin" />
            <Label v-if="error" text="Error registering account" class="error" />
        </StackLayout>
    </Page>
</template>
<script>
import axios from 'axios';
import Login from './Login.vue';
import { Dialogs } from '@nativescript/core';
export default {
    data() {
        return {
            email: '',
            password: '',
            error: null,
            apiHost: "192.168.20.40",
        };
    },
    methods: {
        goToLogin() {
            this.$navigateTo(Login);
        },
        async getToken() {
            const response = await axios.post(`http://${this.apiHost}:3000/api/users/register`, {
                username: this.username,
                email: this.email,
                password: this.password,
            });
            return response.data.token;
        },
        async register() {
            try {
                await axios.post(`http://${this.apiHost}:3000/api/users/register`, {
                    username: this.username,
                    email: this.email,
                    password: this.password,
                });
                Dialogs.alert({
                    title: "Success",
                    message: "Account created successfully. Please login to continue.",
                    okButtonText: "Back to login"
                }).then(() => {
                    this.$navigateTo(Login);
                });
            } catch (error) {
                alert(error);
                this.error = 'Error registering account';
            }
        },
    },
};
</script>
