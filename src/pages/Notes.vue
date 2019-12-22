<template>
  <q-page>
    <q-list>
      <q-item-label header>Notes</q-item-label>
      <q-item clickable v-ripple>

        <q-item-section avatar>
          <q-avatar color="primary" text-color="white" icon="add"></q-avatar>
        </q-item-section>

        <q-item-section @click="addNote=true">
          <q-item-label>New Note</q-item-label>
        </q-item-section>

      </q-item>
      <Note 
        v-for="note in orderBy(notes,'done','createdAt')" 
        :key="note.id" 
        :note="note.data()" 
        :nid="note.id"
        @viewNote="viewNote"
      />
    </q-list>

    <q-drawer show-if-above v-model="right" side="right" bordered>
      <div>

        <div v-if="selected.image" :style="'background-image: url(' + selected.image + ')'" style="width: 100%; height: 200px; background-position:center; background-size:cover;'"></div>

        <div class="text-subtitle1 q-pa-sm">
          {{ selected.title }}
          <q-avatar v-if="selected.done" color="primary" text-color="white" icon="done" size="xs"/>
        </div>

        <div v-if="selected.startDate" class="text-caption q-pl-sm q-pb-sm">{{ selected.startDate }}<span v-if="selected.endDate"> ~ {{ selected.endDate }}</span></div>

        <q-separator />

        <div class="q-pa-sm" v-html="selected.content"></div>
      </div>
    </q-drawer>

    <q-dialog persistent maximized v-model="addNote">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div>New Note</div>
        </q-card-section>

        <q-card-section>
          <q-input 
            dense 
            v-model="note.title" 
            label="Title" 
            autofocus 
          />
          <div class="q-my-md text-headline">Content</div>
          <q-editor v-model="note.content" min-height="10rem" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Add Note" @click="saveNote" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script>
import { auth,db } from 'boot/firebase'
import Note from '../components/Note'
import Vue2Filters from 'vue2-filters'
export default {
  components: {
    Note
  },
  created() {
    auth.onAuthStateChanged((user) => {
      db.collection('users').doc(user.uid)
      .get().then((user) => {
        this.user = user.data()
        this.user.uid = user.id
        db.collection('notes').where('uid','==',user.id)
        .get().then(userNotes => {
          userNotes.forEach(note => {
            this.notes.push(note)
          });
        })
        db.collection('users').doc(user.data().partner)
        .get().then((partner) => {
          this.partner = partner.data()
          db.collection('notes').where('uid','==',partner.id)
          .get().then(partnerNotes => {
            partnerNotes.forEach(note => {
              this.notes.push(note)
            });
          })
        })
      })
    });
  },
  data() {
    return {
      list: {},
      notes: [],
      user: {},
      addNote: false,
      note: {
        content: ''
      },
      right: false,
      selected: {}
    }
  },
  methods: {
    saveNote() {
      this.note.createdAt = new Date()
      this.note.uid= this.user.uid
      db.collection('notes').add(this.note).then(
        this.addNote = false
      )
    },
    viewNote(id) {
      db.collection('notes').doc(id).onSnapshot(note => {
        this.selected = note.data()
      })
      this.right = true
    }
  },
  mixins: [Vue2Filters.mixin]
}
</script>