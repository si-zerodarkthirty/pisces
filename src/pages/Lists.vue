<template>
  <q-page>
    <q-list>
      <q-item clickable v-ripple>

        <q-item-section avatar>
          <q-avatar color="primary" text-color="white" icon="add"></q-avatar>
        </q-item-section>

        <q-item-section @click="addList=true">
          <q-item-label>New List</q-item-label>
        </q-item-section>

      </q-item>
      <List 
        v-for="list in orderBy(lists,'createdAt',-1)" 
        :key="list.id" 
        :lid="list.id"
        :list="list.data()"
      />
    </q-list>

    <q-dialog v-model="addList">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div>New List</div>
        </q-card-section>

        <q-card-section>
          <q-input 
            dense 
            v-model="name" 
            label="Name" 
            autofocus 
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Add List" @click="saveList" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script>
import firebase from 'firebase'
import { auth, db } from 'boot/firebase' 
import List from '../components/List'
import Vue2Filters from 'vue2-filters'
export default {
  components: {
    List
  },
  data() {
    return {
      lists: [],
      addList: false,
      user: {},
      name: ''
    }
  },
  created() {
    auth.onAuthStateChanged((user) => {
      db.collection('users').doc(user.uid)
      .get().then((user) => {
        this.user = user.data()
        this.user.uid = user.id
        db.collection('lists').where('uid','==',user.id)
        .get().then(userLists => {
          userLists.forEach(list => {
            this.lists.push(list)
          });
        })
        db.collection('users').doc(user.data().partner)
        .get().then((partner) => {
          this.partner = partner.data()
          db.collection('lists').where('uid','==',partner.id)
          .get().then(partnerLists => {
            partnerLists.forEach(list => {
              this.lists.push(list)
            });
          })
        })
      })
    });
  },
  methods: {
    saveList() {
      db.collection('lists').add({
        name: this.name,
        uid: this.user.uid,
        createdAt: new Date()
      }).then(
        this.addList = false
      )
    }
  },
  mixins: [Vue2Filters.mixin]
}
</script>