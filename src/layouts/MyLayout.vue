<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-white text-primary" height-hint="98">
      <q-toolbar>

        <q-btn v-if="user" dense flat round icon="menu" @click="leftDrawerOpen = !leftDrawerOpen" />

      </q-toolbar>

    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      content-class="bg-primary text-white"
    >
      <q-list>
        <q-item clickable @click="$router.push('/')">
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Home</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable @click="$router.push('/lists')">
          <q-item-section avatar>
            <q-icon name="list" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Lists</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable @click="$router.push('/notes')">
          <q-item-section avatar>
            <q-icon name="edit" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Notes</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { auth } from "boot/firebase";
export default {
  data () {
    return {
      leftDrawerOpen: false,
      user: {}
    }
  },
  created() {
    auth.onAuthStateChanged((user) => {
      this.user = user
    })
  }
}
</script>
