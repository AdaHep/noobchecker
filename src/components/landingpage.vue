<template>
  <div class="d-flex flex-column align-center">
    <div class="text-center mt-12" style="width: 100%">
      <h2 class="text-h2 font-weight-bold">$$$$ Welcome to noobcheker $$$$</h2>
    </div>

    <div class="mt-12 d-flex" style="width: 40%">
      <v-text-field
        v-model="gamerInput"
        placeholder="Vem dönar på datan då?"
        outlined
        class="ma-2"
        :disabled="gamers.length === 5"
        @keyup.enter="addName"
      ></v-text-field>
      <v-text-field
        v-model="costOfDeath"
        label="Hur mycket GÖLD kostar varje death?"
        outlined
        class="ma-2"
      ></v-text-field>
    </div>

    <div class="d-flex flex-column align-center mb-11" style="width: 100%">
      <h2 v-if="gamers.length > 0" class="text-h2 font-weight-bold mt-2">Gamers</h2>

      <div class="d-flex pa-3" style="width: 100%; height: 100%">
        <v-card
          v-for="(item, index) in gamers"
          :key="index"
          class="ma-4 name-card d-flex flex-column align-center justify-center"
          style="width: 20%; height: 400px"
        >
          <v-btn
            icon
            class="elevation-0"
            style="position: absolute; top: 0; right: 0"
            @click="removeGamer(index)"
          >
            X
          </v-btn>
          <h2 class="text-h2 font-weight-bold">{{ item.name }}</h2>
          <div class="counter-container d-flex align-center flex-column">
            <h5>Hur många gånger har sopan dött?</h5>
            <span class="number-display" style="font-size: 48px">{{ item.numberOfDeaths }}</span>
            <v-btn icon class="elevation-0 mb-12" @click="increaseNumber(index)">
              <img src="/src/assets/graveyard.png" alt="R.I.P" width="100%" />
            </v-btn>

            <h5>Hur mycket ska han betala till potten då?</h5>

            <h5 style="font-size: 34px">{{ item.needsToPay + ' GÖLD' }}</h5>

            <h5 v-if="totalPot > 0">Del av potten:</h5>
            <h5 v-if="totalPot > 0" style="font-size: 34px">
              {{ item.potShare ? item.potShare + ' GÖLD' : '0' }}
            </h5>
          </div>
        </v-card>
      </div>

      <div v-if="gamers.length > 0" class="d-flex flex-column align-center">
        <h3 class="text-h3 font-weight-bold mt-2">POTTEN ÄR: {{ totalPot + ' GÖLD' }}</h3>
        <div>
          <v-btn class="ma-2" style="width: 45%" @click="resetGamers">Nollställ namn</v-btn>
          <v-btn class="ma-2" style="width: 45%" @click="resetGold">Nollställ göld</v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LandingPage',

  data() {
    return {
      gamerInput: '',
      costOfDeath: 0,
      gamers: [],
    }
  },

  computed: {
    totalPot() {
      return this.gamers.reduce((total, gamer) => total + gamer.needsToPay, 0)
    },
  },

  methods: {
    addName() {
      if (this.gamerInput.trim() && this.gamers.length < 5) {
        this.gamers.push({
          name: this.gamerInput.trim(),
          numberOfDeaths: 0,
          needsToPay: 0,
          potShare: null, // New property for storing each gamer's part of the pot
        })
        this.gamerInput = ''
        this.calculatePotShare() // Call to update shares after adding a gamer
      }
    },

    increaseNumber(index) {
      this.gamers[index].numberOfDeaths++
      this.gamers[index].needsToPay = this.gamers[index].numberOfDeaths * this.costOfDeath
      this.calculatePotShare() // Call to update shares after increasing deaths
    },

    removeGamer(index) {
      this.gamers.splice(index, 1)
      this.calculatePotShare() // Call to update shares after removing a gamer
    },

    resetGamers() {
      this.gamers = []
    },

    resetGold() {
      this.gamers.forEach((gamer) => {
        gamer.numberOfDeaths = 0
        gamer.needsToPay = 0
        gamer.potShare = null
      })
      this.calculatePotShare() // Call to update shares after resetting
    },

    calculatePotShare() {
      if (this.totalPot === 0) {
        // If there's no total pot, set all potShare to null
        this.gamers.forEach((gamer) => {
          gamer.potShare = null
        })
        return
      }

      // Check if any gamer has 0 deaths
      const noDeathGamers = this.gamers.filter((gamer) => gamer.numberOfDeaths === 0)

      if (noDeathGamers.length > 0) {
        // If any gamer has 0 deaths, they get the full pot, others get 0
        this.gamers.forEach((gamer) => {
          gamer.potShare = gamer.numberOfDeaths === 0 ? this.totalPot : 0
        })
      } else {
        // All players have died at least once, split pot proportionally
        const totalInverseDeaths = this.gamers.reduce(
          (sum, gamer) => sum + 1 / gamer.numberOfDeaths,
          0,
        )

        this.gamers.forEach((gamer) => {
          gamer.potShare = Math.round(
            (this.totalPot * (1 / gamer.numberOfDeaths)) / totalInverseDeaths,
          )
        })
      }
    },
  },
}
</script>

<style scoped>
.fill-height {
  height: 100%;
}
</style>
