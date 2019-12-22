<template>
  <q-avatar>
    <img :src="user.photoURL">
  </q-avatar>
</template>

<script>
import { db } from 'boot/firebase'
export default {
  props: ['uid'],
  data() {
    return {
      user: {}
    }
  },
  firestore() {
    return {
      user: db.collection('users').doc(this.$props.uid)
    }
  }
}
</script>