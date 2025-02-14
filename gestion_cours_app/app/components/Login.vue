<template>
    <Page>
        <ActionBar title="Login" />
        <StackLayout>
            <TextField v-model="email" hint="email" keyboardType="email" />
            <TextField v-model="password" hint="password" secure="true" />
            <Button text="Login" @tap="login" />
            <!-- <Label v-if="error" text="Invalid credentials" class="error" /> -->
            <Button text="Register" @tap="register" />
        </StackLayout>
    </Page>
</template>
<script>
import { ApplicationSettings } from "@nativescript/core";
import { Dialogs } from '@nativescript/core';
import axios from "axios/dist/axios";
import Register from './Register.vue';
import CourseList from './CourseList.vue';
export default {
    data() {
        return {
            apiHost: "192.168.20.40",
            email: '',
            password: '',
            error: null,
            userToken: null
        };
    },
    methods: {
        async register() {
            this.$navigateTo(Register);
        },
        async login() {
            try {
                const response = await axios.post(`http://${this.apiHost}:3000/api/users/login`, {
                    email: this.email,
                    password: this.password,
                });
                if (response.data) {
                    console.log(response.data.token);
                    ApplicationSettings.setString("userToken", response.data.token)
                    this.$navigateTo(CourseList);
                }
            } catch (error) {
                Dialogs.alert({
                    title: "Error",
                    message: "Invalid login credentials",
                    okButtonText: "OK"
                });
                console.log(error);
                this.error = 'Invalid login credentials';
            }
        },
    },
    mounted() {
        this.userToken = ApplicationSettings.getString("userToken");
        if (this.userToken) this.$navigateTo(CourseList);
    }
};
</script>
