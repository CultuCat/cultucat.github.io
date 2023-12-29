<template>
    <v-card class="mx-auto" min-width="400" max-width="600">
        <v-toolbar flat color="#ff6961" dark>
            <v-btn icon @click="quitFiltersDialog">
                <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Filter results</v-toolbar-title>
        </v-toolbar>
        <template v-if="loading">
            <v-progress-linear indeterminate class="mb-4"></v-progress-linear>
        </template>
        <template v-else>
            <v-card-text>
                <h2 class="text-h6 mb-2">
                    Tags
                </h2>
                <v-chip-group v-model="tagsSelected" column multiple>
                    <v-chip v-for="tag in tags" filter variant="outlined">
                        {{ tag.nom.replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase()) }}
                    </v-chip>
                </v-chip-group>
            </v-card-text>
            <v-btn class="position-relative ma-4" @click="filterBy" color="#87CEEC">
                Filter
            </v-btn>
        </template>
    </v-card>
</template>

<script>
export default {
    data() {
        return {
            tagsSelected: [],
            tags: [],
            loading: false,
        };
    },
    props:{
        idxTagsProp: Array,
    },
    methods: {
        getTags() {
            this.loading = true;
            fetch("https://cultucat.hemanuelpc.es/tags/")
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`Error al obtener los usuarios: ${response.status}`);
                    }
                    return response.json();
                })
                .then((data) => {
                    this.tags = data;
                    this.loading = false;
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        getSpaces() {
            fetch("https://cultucat.hemanuelpc.es/spaces/")
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`Error al obtener los usuarios: ${response.status}`);
                    }
                    return response.json();
                })
                .then((data) => {
                    this.items_get = data;
                    this.loaded = true;
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        quitFiltersDialog() {
            this.$emit("quit-filters-dialog");
        },
        filterBy() {
            let filterTags = this.tags.filter((tag, index) => {
                const indiceEnTagsSelected = this.tagsSelected.findIndex(obj => obj === tag.id-1);
                return indiceEnTagsSelected !== -1;
            });
            const idxTags = this.tagsSelected;
            this.$emit("filter-by", {filterTags, idxTags});
        }
    },
    mounted() {
        this.getTags();
        this.tagsSelected = this.idxTagsProp;
    }
};
</script>