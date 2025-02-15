<template>
    <Page>
        <ActionBar title="Course List" />
        <StackLayout>
            <Button text="Add Course" @tap="addCourse" />
            <Button text="Logout" @tap="logout()" />
            <Label v-if="error" text="Error loading courses" class="error" />
            <Label :text="this.error" row="0" col="0" backgroundColor="#777777" color="#ffffff" />
            <ListView for="course in courses" @itemTap="">
                <v-template>
                    <GridLayout columns="*" rows="*, *, *, *, *, *">
                        <Label :text="course.course_code" row="0" col="0" backgroundColor="#43B344" />
                        <Label :text="course.course_name" row="1" col="0" backgroundColor="#777777" color="#ffffff" />
                        <Label :text="course.credits" row="2" col="0" backgroundColor="#777777" color="#ffffff" />
                        <Label :text="course.semester" row="3" col="0" backgroundColor="#777777" color="#ffffff" />
                        <Label :text="course.description" row="4" col="0" backgroundColor="#777777" color="#ffffff" />
                        <GridLayout columns="*,*" rows="*" row="5" col="0">
                            <Button backgroundColor="#777777" color="#ffffff" row="0" col="0" text="Modify"
                                @tap="modifyCourse(course)" />
                            <Button backgroundColor="#777777" color="#ffffff" row="0" col="1" text="Delete"
                                @tap="deleteCourse(course.id)" />
                        </GridLayout>
                    </GridLayout>
                </v-template>
            </ListView>
            
        </StackLayout>
    </Page>
</template>
<script>
import { ApplicationSettings } from "@nativescript/core";
import EditCourse from './EditCourse.vue';
import Login from './Login.vue';
import axios from 'axios';
export default {
    data() {
        return {
            apiHost: "192.168.20.40",
            courses: [],
            error: null,
            token: ""
        };
    },
    async mounted() {
        try {
            this.token = ApplicationSettings.getString("userToken");
            if (!this.token) this.$navigateTo(Login);
            this.getCourses();
        } catch (error) {
            this.error = 'Failed to load courses';
            console.log(this.error);
        }
    },
    methods: {
        async addCourse() {
            try {
                this.$navigateTo(EditCourse, {
                    props: {
                        newCourse: true
                    }
                });
            } catch (error) {
                this.error = 'Failed to add course';
                console.log(this.error);
            }
        },
        async getCourses() {
            let config = {
                method: 'get',
                url: `http://${this.apiHost}:3000/api/courses`,
                headers: {
                    'Authorization': 'Bearer ' + this.token
                },
                data: []
            };
            const response = await axios.request(config);
            console.log(response.data);
            this.courses = response.data;
            console.log(this.courses);
        },
        async deleteCourse(id) {
            try {
                let config = {
                    method: 'delete',
                    url: `http://${this.apiHost}:3000/api/courses/${id}`,
                    headers: {
                        'Authorization': 'Bearer ' + this.token
                    },
                    data: []
                };
                const response = await axios.request(config);
                console.log(response);
                this.courses = this.courses.filter((course) => course.id !== id);
                alert("Course deleted successfully");
            } catch (error) {
                this.error = 'Failed to delete course';
                console.error(this.error);
                console.error(error);
                alert({
                    title: 'Failed to delete course',
                    message: error.response.data.message,
                    okButtonText: 'OK'
                });
            }
        },
        async modifyCourse(course) {
            try {
                console.log('Navigating to edit course:');
                console.log(course);
                await this.$navigateTo(EditCourse, {
                    props: {
                        course: course,
                    }
                });
            } catch (error) {
                this.error = 'Failed to modify course';
                console.error('Navigation error:', error);
                alert("Failed to modify course");
            }
        },
        logout() {
            ApplicationSettings.remove("userToken");
            this.$navigateTo(Login);
        }
    },
    // watch: {
    //     error: {
    //         handler(newValue) {
    //             if (newValue?.length > 0) {
    //                 alert({
    //                     title: 'Error',
    //                     message: newValue,
    //                     okButtonText: 'OK'
    //                 })
    //             }
    //         }
    //     }
    // }
};
</script>
