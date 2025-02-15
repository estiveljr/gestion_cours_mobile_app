<template>
    <Page>
        <ActionBar :title="newCourse ? 'Add Course' : 'Edit Course'" />
        <StackLayout>
            <!-- <Label v-if="error" :text="error" class="error" /> -->
            
            <Label text="Course Code" />
            <TextField v-model="courseData.course_code" :hint="courseData.course_code" />
            
            <Label text="Course Name" />
            <TextField v-model="courseData.course_name" :hint="courseData.course_name" />
            
            <Label text="Credits" />
            <TextField v-model="courseData.credits" :hint="courseData.credits" />
            
            <Label text="Semester" />
            <TextField v-model="courseData.semester" :hint="courseData.semester" />
            
            <Label text="Description" />
            <TextField v-model="courseData.description" :hint="courseData.description" />
             
            <Button v-if="!newCourse" text="Update Course" @tap="updateCourse" />
            <Button v-if="newCourse" text="Add Course" @tap="addCourse" />
            <Button text="Logout" @tap="logout" />
            
        </StackLayout>
    </Page>
</template>
<script>
import { ApplicationSettings } from "@nativescript/core";
import Login from './Login.vue';
import CourseList from './CourseList.vue';
import axios from 'axios';

export default {
    props: ['course'],
    data() {
        return {
            apiHost: "192.168.20.40",
            courseData: {
                id: "",
                course_code: "",
                course_name: "",
                credits: "",
                semester: "",
                description: ""
            },
            newCourse: true,
            error: null,
            token: "",
        };
    },
    created() {
        if (this.course) {
            this.courseData = { ...this.course };
            this.newCourse = false;
        }else{
            this.newCourse = true;
        }
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
                    url: `http://${this.apiHost}:3000/api/courses/update-course/${this.courseData.id}`,
                    headers: {
                        'Authorization': 'Bearer ' + this.token
                    },
                    data: {
                        course_code: this.courseData.course_code,
                        course_name: this.courseData.course_name,
                        credits: this.courseData.credits,
                        semester: this.courseData.semester,
                        description: this.courseData.description,
                        updated_at: new Date().toISOString()
                    }
                };
                console.log(config.data);
                const response = await axios.request(config);
                console.log(response);
                this.courseData = {
                    course_id: "",
                    course_code: "",
                    course_name: "",
                    credits: "",
                    semester: "",
                    description: ""
                };
                alert("Course updated successfully");
                this.$navigateTo(CourseList);
            } catch (error) {
                console.error('Update error:', error);
                this.error = 'Failed to update course';
                alert("Failed to update course");
            }
        },
        async addCourse() {
            console.log("Adding course");
            try {
                let config = {
                    method: 'post',
                    url: `http://${this.apiHost}:3000/api/courses/add-course`,
                    headers: {
                        'Authorization': 'Bearer ' + this.token
                    },
                    data: { courses:[{
                            course_code: this.courseData.course_code,
                            course_name: this.courseData.course_name,
                            credits: this.courseData.credits,
                            semester: this.courseData.semester,
                            description: this.courseData.description,
                        }
                    ]
                    }
                };
                console.log(config.data);
                const response = await axios.request(config);
                console.log(response);
                this.courseData = {
                    course_id: "",
                    course_code: "",
                    course_name: "",
                    credits: "",
                    semester: "",
                    description: ""
                };
                alert("Course added successfully");
                this.$navigateTo(CourseList);
            } catch (error) {
                console.error('Add course error:', error);
                this.error = 'Failed to add course';
                alert("Failed to add course");
            }
        },
        logout() {
            ApplicationSettings.remove("userToken");
            this.$navigateTo(Login);
        }
    },
};
</script>
