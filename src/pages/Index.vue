<template>
  <q-page v-if="currentUser">
    <q-card class="q-ma-md">
      <q-parallax
        :src="user.bg"
        :height="150"
      />
      <q-card-section>
        <div class="flex flex-center">
          <div class="q-mr-lg" @click="edit=true" style="cursor: pointer;">
            <q-avatar class="block q-mx-auto" size="80px">
              <img :src="user.photoURL">
            </q-avatar>
            <p class="text-center text-subtitle2">{{ user.name }}</p>
          </div>
          <div v-if="user.partner">
            <q-avatar class="block q-mx-auto" size="80px">
              <img :src="partner.photoURL">
            </q-avatar>
            <p class="text-center text-subtitle2">{{ partner.name }}</p>
          </div>
          <div v-else>
            <q-avatar rounded class="block q-mx-auto" size="80px">
              <img src="https://cdn.quasar.dev/img/avatar.png">
            </q-avatar>
            <p class="text-center text-subtitle1 q-mt-sm cursor-pointer" @click="invite = true">Invite Partner</p>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-dialog v-model="edit">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div>Edit Profile</div>
        </q-card-section>

        <q-card-section>
          <q-input 
            dense 
            v-model="user.name" 
            label="Name" 
            autofocus 
          />
          <q-input 
            dense 
            v-model="user.photoURL" 
            label="Photo URL" 
          />
          <q-input 
            dense 
            v-model="user.bg" 
            label="Background Image URL" 
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Save Profile" @click="saveProfile" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-btn 
      class="block q-mx-auto" 
      flat 
      color="primary" 
      label="Sign Out" 
      @click="signOut"
    />
  </q-page>

  <q-page v-else>
    <h5 class="text-center">Sign In</h5>
    <q-btn 
      class="block q-mx-auto" 
      flat 
      color="primary" 
      icon="fab fa-google" 
      label="Google Sign-In" 
      @click="signIn"
    />
  </q-page>
</template>

<script>
import firebase from 'firebase'
import { auth, db } from 'boot/firebase' 
export default {
  data() {
    return {
      currentUser: {},
      user: {},
      partner: {},
      edit: false
    }
  },
  created() {
    auth.onAuthStateChanged((user) => {
      this.currentUser = user
      db.collection('users').doc(user.uid)
      .get().then((user) => {
        this.user = user.data()
        this.user.uid = user.id
        db.collection('users').doc(user.data().partner)
        .get().then((partner) => {
          this.partner = partner.data()
          this.partner.uid = partner.id
        })
      })
    });
  },
  methods: {
    signIn() {
      const provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider)
        .then((result) => {
          db.collection('users').doc(result.user.uid).get()
          .then(user => {
            if (user.exists) {
              this.$q.notify({
                message: 'Welcome back, '+user.data().name+'!',
              })
            } else {
              this.$q.notify({
                message: 'Hi, '+result.user.displayName+'!',
              })
              this.createUser(result.user)
              this.createCouple(result.user)
            }
          })
        });
    },
    createUser(user) {
      db.collection('users').doc(user.uid).set({
        name: user.displayName,
        photoURL: user.photoURL,
        email: user.email,
        intro: '',
        partner: ''
      }, { merge: true })
    },
    signOut() {
      auth.signOut()
    },
    saveProfile() {
      db.collection('users').doc(this.user.uid).update(this.user)
      .then(
        this.edit = false
      )
      db.collection('users').doc(this.partner.uid).update({
        bg: this.user.bg
      })
      .then(
        this.edit = false
      )
    },
    invite() {

    }
  }
}
</script>
