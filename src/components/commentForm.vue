<template>
    <v-form @submit.prevent="submitComment">
        <v-text-field v-model="comment" label="Comment" required variant="outlined"></v-text-field>
        <v-btn type="submit" color="primary">Send Comment</v-btn>
    </v-form>
</template>
  
<script>
export default {
    data() {
        return {
            comment: '',
        };
    },
    methods: {
        submitComment() {
            // post del comment
            this.comment = '';
        },
    },
};
</script>
  