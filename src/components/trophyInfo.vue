<template>
    <v-fade-transition hide-on-leave>
        <v-card class="mx-auto" elevation="16" rounded="lg" width="500">

            <v-divider></v-divider>
            <div class="text-center"><v-icon size="50" class="mt-6">mdi-medal-outline</v-icon></div>
            <div class="text-h4 font-weight-bold text-center mt-6">{{ trophy.nom }}</div>
            <div class="text-h5 font-weight-bold text-center mt-6">{{ achieved ? $t('TROFEUS.Nivell') + trophy.level_achived_user : $t('TROFEUS.No_aconseguit')}}</div>

            <v-progress-linear v-model="percentage" height="20" color="green" striped rounded class="my-6  w-75">
                <strong>{{ Math.ceil(this.percentage) }}%</strong>
            </v-progress-linear>

            <div class="py-8 pl-6 text-start">
                <p><strong>{{$t('TROFEUS.Descripcio')}}:</strong> {{ trophy.descripcio }}.</p>
                <p class="mt-6"><strong>{{ logMessage }}</strong></p>
                <p><strong>{{ toAchieve }}</strong></p>
            </div>

            <div class="pa-4 text-end">
                <v-btn class="text-none" color="medium-emphasis" min-width="92" rounded variant="outlined"
                    @click="quitDialog">
                    {{$t('close')}}
                </v-btn>
            </div>
        </v-card>
    </v-fade-transition>
</template>

<script>
export default {
    data() {
        return {
            nextLevelPoints: -1,
            actionsToNextLevel: -1,
            allAchieved: `${this.$t('TROFEUS.Tots_aconseguits')}`,
            logMessage: "",
            toAchieve: "",
            percentage: 0,
        };
    },
    props: {
        trophy: Object,
    },
    methods: {
        quitDialog() {
            this.$emit("quit-trophyDialog");
        },
        calculateActionsToNextLevel() {
            if(this.trophy.level_achived_user == -1){
                this.nextLevelPoints = this.trophy['punts_nivell1'];
                this.actionsToNextLevel = this.nextLevelPoints - this.trophy.progress;
            }
            else if(this.trophy.level_achived_user < 3){
                this.nextLevelPoints = this.trophy['punts_nivell' + (this.trophy.level_achived_user+1).toString()];
                this.actionsToNextLevel = this.nextLevelPoints - this.trophy.progress;
            }
        },
        generateMessage() {
            switch (this.trophy.nom) {
                case "Col·leccionista d'or":
                    this.logMessage = `${this.$t('TROFEUS.CollectorOr')} ${this.trophy.progress} ${this.$t('TROFEUS.CollectorOr_trophy')}`;
                    if (this.trophy.level_achived_user < 3) {
                        this.toAchieve = `${this.$t('TROFEUS.CO_guanya')} ${this.actionsToNextLevel} ${this.$t('TROFEUS.CO_achieve')} ${this.achieved ? this.trophy.level_achived_user + 1 : 1}.`;
                    }
                    break;

                case "Popular":
                    this.logMessage = `${this.$t('TROFEUS.P_you')} ${this.trophy.progress} ${this.$t('TROFEUS.P_friends')}`;
                    if (this.trophy.level_achived_user < 3) {
                        this.toAchieve = `${this.$t('TROFEUS.P_make')} ${this.actionsToNextLevel} ${this.$t('TROFEUS.P_mes_amics')} ${this.achieved ? this.trophy.level_achived_user + 1 : 1}.`;
                    }
                    break;

                case "Explorador cultural":
                    this.logMessage = `${this.$t('TROFEUS.E_attended')} ${this.trophy.progress} ${this.$t('TROFEUS.E_events')}`;
                    if (this.trophy.level_achived_user < 3) {
                        this.toAchieve = `${this.$t('TROFEUS.E_assist')} ${this.actionsToNextLevel} ${this.$t('TROFEUS.E_mes_events')} ${this.achieved ? this.trophy.level_achived_user + 1 : 1}.`;
                    }
                    break;

                case "Reviewer":
                    this.logMessage = `${this.$t('TROFEUS.R_you')} ${this.trophy.progress} ${this.$t('TROFEUS.R_comments')}`;
                    if (this.trophy.level_achived_user < 3) {
                        this.toAchieve = `${this.$t('TROFEUS.R_write')} ${this.actionsToNextLevel} ${this.$t('TROFEUS.R_mes_comments')} ${this.achieved ? this.trophy.level_achived_user + 1 : 1}.`;
                    }
                    break;

                case "Xerraire":
                    this.logMessage = `${this.$t('TROFEUS.X_you')} ${this.trophy.progress} ${this.$t('TROFEUS.X_messages')}`;
                    if (this.trophy.level_achived_user < 3) {
                        this.toAchieve = `${this.$t('TROFEUS.X_enviar')} ${this.actionsToNextLevel} ${this.$t('TROFEUS.X_mes_messages')} ${this.achieved ? this.trophy.level_achived_user + 1 : 1}.`;
                    }
                    break;

                default:
                    this.logMessage = `${this.$t('TROFEUS.T_unexpected')}`;
                    break;
            }
            if (this.trophy.level_achived_user === 3) {
                this.toAchieve = this.allAchieved;
            }
        },
        calculatePercentage() {
            if (this.nextLevelPoints === -1) this.percentage = 100;
            else this.percentage = (this.trophy.progress / this.nextLevelPoints) * 100;
        }
    },
    mounted() {
        this.calculateActionsToNextLevel()
        this.calculatePercentage();
        this.generateMessage(this.trophy);
    },
    computed: {
        achieved() {
            return this.trophy.level_achived_user !== -1;
        }
    }
};
</script>