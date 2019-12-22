<template>
  <q-item clickable v-ripple>

    <q-item-section avatar>
      <Avatar :uid="list.uid" />
    </q-item-section>

    <q-item-section @click="$router.push('/items/'+lid)">
      <q-item-label>{{ list.name }}</q-item-label>
      <q-item-label caption>{{ items.length }} <span v-if="items.length > 1">items</span><span v-else>item</span></q-item-label>
    </q-item-section>

  </q-item>
</template>

<script>
import { db } from "boot/firebase";
import Avatar from './Avatar'
export default {
  props: ['lid','list'],
  components: {
    Avatar
  },
  data() {
    return {
      items: []
    }
  },
  firestore() {
    return {
      items: db.collection('items').where('lid','==',this.$props.lid)
    }
  }
}
</script>