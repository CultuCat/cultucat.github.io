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
            formData: {
                text: 0,
                event: "",
            },
            comment: "",
        };
    },
    methods: {
        async submitComment() {
            this.formData.text = this.comment;
            this.formData.event = this.$route.params.event_id;

            try {
                const response = await fetch('https://cultucat.hemanuelpc.es/comments/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(this.formData),
                });

                if (response.ok) {
                    this.$emit('comment-posted');
                    this.comment = '';
                } else {
                    console.error('Error al enviar comentario');
                }
            } catch (error) {
                console.error('Error en la solicitud POST:', error);
            }
        },
    },
};
</script>
