<template>
    <Page>
        <ActionBar title="Course List" />
        <StackLayout>
            <!-- <Label v-if="error" text="Error loading courses" class="error" /> -->
            <Label :text="this.error" row="0" col="0" backgroundColor="#777777" color="#ffffff" />
            <ListView for="course in courses" @itemTap="">
                <v-template>
                    <GridLayout columns="*" rows="*, *, *, *, *, *, *">
                        <Label :text="course.course_code" row="0" col="0" backgroundColor="#43B344" />
                        <Label :text="course.course_name" row="1" col="0" backgroundColor="#777777" color="#ffffff" />
                        <Label :text="course.credits" row="2" col="0" backgroundColor="#777777" color="#ffffff" />
                        <Label :text="course.semester" row="3" col="0" backgroundColor="#777777" color="#ffffff" />
                        <Label :text="course.description" row="4" col="0" backgroundColor="#777777" color="#ffffff" />
                        <GridLayout columns="*,*" rows="*" row="5" col="0">
                            <!-- <Button backgroundColor="#00ff00" color="#ffffff" row="0" col="0" text="Modify"
                                @tap="modifyCourse(course.course_id)" /> -->
                            <Button backgroundColor="#777777" color="#ffffff" row="0" col="0" text="Modify"
                                @tap="modifyCourse(course)" />
                            <Button backgroundColor="#777777" color="#ffffff" row="0" col="1" text="Delete"
                                @tap="deleteCourse(course.course_id)" />
                        </GridLayout>
                    </GridLayout>
                </v-template>
            </ListView>
            <!-- <TextField v-model="newCourseCode" hint="New Course Code" />
            <TextField v-model="newCourseName" hint="New Course Name" />
            <TextField v-model="newCourseCredits" hint="New Course Credits" />
            <TextField v-model="newCourseSemester" hint="New Course Semester" />
            <TextField v-model="newCourseDescription" hint="New Course Description" /> -->
            <Button text="Add Course" @tap="addCourse" />
            <Button text="Logout" @tap="logout()" />
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
            newCourseCode: '',
            newCourseName: '',
            newCourseCredits: '',
            newCourseSemester: '',
            newCourseDescription: '',
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
                let config = {
                    method: 'post',
                    url: `http://${this.apiHost}:3000/api/add-course`,
                    headers: {
                        'Authorization': 'Bearer ' + this.token
                    },
                    data: {
                        course_code: this.newCourseCode,
                        course_name: this.newCourseName,
                        credits: this.newCourseCredits,
                        semester: this.newCourseSemester,
                        description: this.newCourseDescription
                    }
                };
                const response = await axios.request(config);
                this.getCourses();
                this.newCourseCode = '';
                this.newCourseName = '';
                this.newCourseCredits = '';
                this.newCourseSemester = '';
                this.newCourseDescription = '';
            } catch (error) {
                this.error = 'Failed to add course';
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
        async modifyCourse(course) {
            this.$navigateTo(EditCourse, {
                context: {
                    course: course
                }
            });
            try {
                this.$navigateTo(EditCourse, {
                    context: {
                        course: course
                    }
                });
            } catch (error) {
                this.error = 'Failed to modify course';
                console.log(this.error);
                console.log(error)
            }
        },
        logout() {
            ApplicationSettings.remove("userToken");
            this.$navigateTo(Login);
        }
    },
};
</script>
