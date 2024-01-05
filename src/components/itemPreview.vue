<!-- ======================================================================= -->
<!--              COMPONENTE QUE MUESTRA UN PREVIEW DE UN ITEM               -->
<!-- ======================================================================= -->

<template>
  <v-card v-if="item.espai" class="my-3 mx-3" elevation="6" @click.prevent="handleClick('/events/', item.id)">
    <v-row>
      <v-col cols="1" xl="1" md="2" sm="1">
        <v-avatar :image="item.imatges_list && item.imatges_list.length > 0 ? item.imatges_list[0] : null"
          class="my-2 mx-5" :size="view === 'map' ? '45' : '120'">
        </v-avatar>
      </v-col>
      <v-col cols="11" lg="10" md="9" sm="9">
        <v-card-title>
          <v-btn icon="mdi-chevron-right" variant="plain" :ripple="false" class="pb-1"></v-btn>
          <strong>{{ item.nom }}</strong>
          <p v-if="item.dataIni" class="dates">
            {{ transformDate(item.dataIni) }}
          </p>

          <v-divider></v-divider>
        </v-card-title>

        <v-card-text class="ml-8">
          {{ acortarTexto(item.descripcio) }}
          <br /><br /><strong>{{
            item.preu ? extraerTextoPreu(item.preu) : $t('EVENT.Preu_NoDisponible')
          }}</strong>
        </v-card-text>
      </v-col>
    </v-row>
  </v-card>

  <v-card v-else class="my-2 mx-3" elevation="4" rounded="xl" :class="getCardClasses()">
    <v-card-item @click="handleClick('/users/', (item.id || item.idUser))" class="clickable">
      <template v-slot:prepend>
        <template v-if="view === 'ranking'">
          <strong>{{ index + 1 }}. </strong>
        </template>
        <v-avatar :image="item.imatge || item.avatar" size="50" class="ml-2 mr-5 my-2"></v-avatar>
        <strong>{{ item.first_name || item.name }}</strong>
      </template>
      <template v-slot:append>
        <template v-if="view === 'ranking'">
          {{$t('USER.PUNTUACIO')}}: {{ item.puntuacio }}
        </template>
        <v-icon v-if="view === 'admin_users' && item.isBlocked">mdi-lock</v-icon>
        <v-icon v-else-if="view === 'admin_users'">mdi-lock-open-outline</v-icon>
        <v-icon v-else>mdi-chevron-right</v-icon>
      </template>
    </v-card-item>
    <v-dialog v-model="dialogBlock" persistent max-width="500px">
      <v-card>
        <v-card-text>{{$t('USER.Bloquejar')}}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red-darken-1" variant="text" @click="dialogBlock = false">
            {{$t('cancel')}}
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="blockUser(item.id)">
            {{$t('USER.Block')}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogUnblock" persistent max-width="500px">
      <v-card>
        <v-card-text>{{$t('USER.Desbloquejar')}}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red-darken-1" variant="text" @click="dialogUnblock = false">
            {{$t('cancel')}}
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="blockUser(item.id)">
            {{$t('USER.Unblock')}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<!-- =============================== SCRIPTS =============================== -->

<script>

export default {
  data() {
    return {
      dialogBlock: false,
      dialogUnblock: false,
    };
  },
  props: {
    item: {
      type: Object,
    },
    view: {
      type: String,
      default: "",
    },
    index: Number,
  },
  computed: {
    token() {
      return this.$store.state.user.token;
    },
    isFirst() {
      return this.index === 0;
    },
    isSecond() {
      return this.index === 1;
    },
    isThird() {
      return this.index === 2;
    },
  },
  methods: {
    handleClick(path, id) {
      if (this.view === 'admin_users') {
        if (this.item.isBlocked)
          this.dialogUnblock = true;
        else
          this.dialogBlock = true;
      }
      else
        window.location.pathname = path + id;
    },
    async blockUser(id) {
      try {
        const response = await fetch(`https://cultucat.hemanuelpc.es/users/${id}/block_profile/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${this.token}`,
          },
          body: JSON.stringify({
            isBlocked: !this.item.isBlocked,
          }),
        });
        if (response.ok) {
          if (this.item.isBlocked)
            this.dialogUnblock = true;
          else
            this.dialogBlock = true;
          window.location.reload();
        } else {
          console.error('Error al bloquear usuario');
        }
      } catch (error) {
        console.error('Error en la solicitud POST:', error);
      }
    },
    transformDate(date) {
      const dateObj = new Date(date);
      const formatOptions = {
        weekday: "short",
        month: "long",
        day: "numeric",
      };
      const formatter = new Intl.DateTimeFormat("en-US", formatOptions);
      return formatter.format(dateObj);
    },
    acortarTexto(texto) {
      if (!texto) return null;
      const palabras = texto.split(" ");
      const maxPalabras = 20;
      if (palabras.length > maxPalabras) {
        const textoAcortado = palabras.slice(0, maxPalabras).join(" ");
        return textoAcortado + "...";
      }
      return texto;
    },
    extraerTextoPreu(texto) {
      // Utilizamos una expresión regular para buscar la parte deseada del texto
      const regex = /Preus?[^€]*€/;
      const match = texto.match(regex);
      return match ? match[0] : texto;
    },
    getCardClasses() {
      if (this.view === 'ranking') {
        return {
          'ranking-style': true,
          'first-place': this.isFirst,
          'second-place': this.isSecond,
          'third-place': this.isThird,
        };
      }
      return {}; // Sin clases adicionales si view no es 'ranking'
    },
  },
};
</script>

<!-- =============================== ESTILOS =============================== -->

<style scoped>
.clickable:hover {
  cursor: pointer;
}

.dates {
  display: inline-block;
  font-size: 0.6em;
  margin-left: 1rem;
}

.first-place {
  background-color: #ffd700;
  /* Color para el primer lugar */
}

.second-place {
  background-color: #c0c0c0;
  /* Color para el segundo lugar */
}

.third-place {
  background-color: #cd7f32;
  /* Color para el tercer lugar */
}
</style>
