<template>
    <v-fade-transition hide-on-leave>
        <v-card append-icon="$close" class="mx-auto" elevation="16" width="500" title="Trophy">
            <template v-slot:append>
                <v-btn icon="$close" variant="text" @click="quitDialog"></v-btn>
            </template>

            <v-divider></v-divider>
            <div class="text-center"><v-icon size="50" class="mt-6">mdi-medal-outline</v-icon></div>
            <div class="text-h4 font-weight-bold text-center mt-6">{{ trophy.nom }}</div>
            <div class="text-h5 font-weight-bold text-center mt-6">Level: {{ trophy.level_achived_user }}</div>

            <v-progress-linear v-model="percentage" height="25" color="green" striped rounded class="my-6  w-75">
                <strong>{{ this.percentage }}%</strong>
            </v-progress-linear>

            <div class="py-12 pl-6 text-start">
                <p><strong>Description:</strong> {{ trophy.descripcio }}.</p>
                <p class="mt-10"><strong>{{ logMessage }}</strong></p>
                <p><strong>{{ toAchieve }}</strong></p>
            </div>

            <div class="pa-4 text-end">
                <v-btn class="text-none" color="medium-emphasis" min-width="92" rounded variant="outlined"
                    @click="quitDialog">
                    Close
                </v-btn>
            </div>
        </v-card>
    </v-fade-transition>
</template>

<script>
export default {
    data() {
        return {
            actionsToNextLevel: this.calculateActionsToNextLevel(this.trophy.level_achived_user, this.trophy.level_achived_user + 1),
            allAchieved: "You've already achieved all levels!",
            logMessage: "",
            toAchieve: "",
            percentage: null,
        };
    },
    props: {
        trophy: Object,
    },
    methods: {
        quitDialog() {
            this.$emit("quit-trophyDialog");
        },
        calculateActionsToNextLevel(currentLevel, targetLevel) {
            return (targetLevel - currentLevel);
        },
        generateMessage(trophy) {
            switch (trophy.nom) {
                case "Coleccionista":
                    this.logMessage = `You have collected ${trophy['punts_nivell' + trophy.level_achived_user]} trophies.`;
                    if (trophy.level_achived_user < 3) {
                        this.toAchieve = `Win ${this.actionsToNextLevel} more trophies to achieve level ${trophy.level_achived_user + 1}.`;
                    }

                    break;

                case "El més amigable":
                    this.logMessage = `You have made ${trophy['punts_nivell' + trophy.level_achived_user]} new friends.`;
                    if (trophy.level_achived_user < 3) {
                        this.toAchieve = `Make ${this.actionsToNextLevel} more friends to achieve level ${trophy.level_achived_user + 1}.`;
                    }
                    break;

                case "Més esdeveniments":
                    this.logMessage = `You have attended ${trophy['punts_nivell' + trophy.level_achived_user]} events..`;
                    if (trophy.level_achived_user < 3) {
                        this.toAchieve = `Assist to ${this.actionsToNextLevel} more events to achieve level ${trophy.level_achived_user + 1}.`;
                    }


                case "Reviewer":
                    this.logMessage = `You wrote ${trophy.level_achived_user} comments.`;
                    if (trophy.level_achived_user < 3) {
                        this.toAchieve = `Write ${this.actionsToNextLevel} more comments to achieve level ${trophy.level_achived_user + 1}.`;
                    }

                    break;

                case "Xerraire":
                    this.logMessage = `You sent ${trophy.level_achived_user} messages. `;
                    if (trophy.level_achived_user < 3) {
                        this.toAchieve = `Send ${this.actionsToNextLevel} more messages to achieve level ${trophy.level_achived_user + 1}.`;
                    }
                    break;

                default:
                    this.logMessage = "Unexpected trophy.";
            }
            if (trophy.level_achived_user === 3) {
                this.toAchieve = allAchieved;
            }
        },
        calculatePercentage() {
            const pointsAchieved = this.trophy['punts_nivell' + this.trophy.level_achived_user];
            const pointsToAchieve = this.trophy['punts_nivell' + (this.trophy.level_achived_user + 1)]
            const percentage = (pointsAchieved / pointsToAchieve) * 100;
            this.percentage = percentage;
        }
    },
    mounted() {
        this.calculatePercentage();
        this.generateMessage(this.trophy);
    }
};
</script>