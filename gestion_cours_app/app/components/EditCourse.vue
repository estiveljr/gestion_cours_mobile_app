<template>
    <Page>
        <ActionBar title="Edit Course" />
        <StackLayout>
            <!-- <ListView @itemTap="">
                <v-template>
                    <GridLayout columns="*" rows="*, *, *, *, *, *, *">
                        <Label :text="course.course_code" row="0" col="0" backgroundColor="#43B344" />
                        <Label :text="course.course_name" row="1" col="0" backgroundColor="#777777" color="#ffffff" />
                        <Label :text="course.credits" row="2" col="0" backgroundColor="#777777" color="#ffffff" />
                        <Label :text="course.semester" row="3" col="0" backgroundColor="#777777" color="#ffffff" />
                        <Label :text="course.description" row="4" col="0" backgroundColor="#777777" color="#ffffff" />
                        <GridLayout columns="*,*" rows="*" row="5" col="0">
                            <Button backgroundColor="#00ff00" color="#ffffff" row="0" col="0" text="Modify"
                                @tap="modifyCourse(course.course_id)" />
                            <Button backgroundColor="#ff0000" color="#ffffff" row="0" col="1" text="Delete"
                                @tap="deleteCourse(course.course_id)" />
                        </GridLayout>
                    </GridLayout>
                </v-template>
            </ListView> -->
            <Label v-if="error" text="Error loading course" class="error" />
            <TextField v-model="this.newCourseCode" :hint="this.course.course_code" />
            <TextField v-model="this.newCourseName" :hint="this.course.course_name" />
            <TextField v-model="this.newCourseCredits" :hint="this.course.credits" />
            <TextField v-model="this.newCourseSemester" :hint="this.course.semester" />
            <TextField v-model="this.newCourseDescription" :hint="this.course.description" />
            <Button text="Update Course" @tap="updateCourse" />
            <Button text="Logout" @tap="logout()" />
        </StackLayout>
    </Page>
</template>
<script>
import { ApplicationSettings } from "@nativescript/core";
import Login from './Login.vue';
import axios from 'axios';
export default {
    props: {
        course: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            apiHost: "192.168.20.40",
            course: {},
            error: null,
            token: ""
        };
    },
    created() {
        this.course = this.$route.context.course;
        console.log("test course");
        console.log(this.course);
    },
    async mounted() {
        try {
            this.token = ApplicationSettings.getString("userToken");
            if (!this.token) this.$navigateTo(Login);
        } catch (error) {
            this.error = 'Failed to load course';
        }
    },
    methods: {
        async updateCourse() {
            try {
                let config = {
                    method: 'put',
                    url: `http://${this.apiHost}:3000/api/course`,
                    headers: {
                        'Authorization': 'Bearer ' + this.token
                    },
                    data: {
                        course_code: this.course.course_code,
                        course_name: this.course.course_name,
                        credits: this.course.credits,
                        semester: this.course.semester,
                        description: this.course.description
                    }
                };
                const response = await axios.request(config);
                // this.course.course_code = '';
                // this.course.course_name = '';
                // this.course.credits = '';
                // this.course.semester = '';
                // this.course.description = '';
                // this.$navigateTo(CourseList);
            } catch (error) {
                this.error = 'Failed to update course';
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
                    url: `http://${this.apiHost}:3000/api/course`,
                    headers: {
                        'Authorization': 'Bearer ' + this.token
                    },
                    data: { course_id: id }
                };
                const response = await axios.request(config);
                this.courses = this.courses.filter((course) => course.course_id !== id);
            } catch (error) {
                this.error = 'Failed to delete course';
            }
        },
        async modifyTask(id) {
            try {
            } catch (error) {
                this.error = 'Failed to delete task';
            }
        },
        logout() {
            ApplicationSettings.remove("userToken");
            this.$navigateTo(Login);
        }
    },
};
</script>
