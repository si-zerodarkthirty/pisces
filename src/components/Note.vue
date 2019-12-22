<template>
  <q-item clickable v-ripple>

    <q-item-section avatar top>
      <Avatar :uid="note.uid" />
    </q-item-section>

    <q-item-section @click="viewNote">
      <q-item-label>{{ note.title }}</q-item-label>
      <q-item-label caption lines="3">{{ note.content }}</q-item-label>

    </q-item-section>

    <q-item-section top side>
      <div>
        <q-btn size="12px" flat dense round icon="edit" @click="edit=true" />
        <q-btn size="12px" flat dense round icon="delete" @click="deleteCnfm=true" />
      </div>
    </q-item-section>

    <q-dialog v-model="deleteCnfm">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div>Delete {{ note.title }} ?</div>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn unelevated color="primary" label="Delete" @click="deleteNote" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="edit" maximized>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div>Edit Note</div>
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
          <q-btn unelevated color="primary" label="Save Note" @click="updateNote" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-item>
</template>

<script>
import { db } from "boot/firebase";
import Avatar from './Avatar'
export default {
  props: ['note','nid'],
  components: {
    Avatar
  },
  data() {
    return {
      deleteCnfm: false,
      edit: false
    }
  },
  methods: {
    deleteNote() {
      db.collection('notes').doc(this.$props.nid).delete()
      .then(
        this.deleteCnfm=false
      )
    },
    updateNote() {
      db.collection('notes').doc(this.$props.nid).update(this.note)
      .then(
        this.edit=false
      )
    },
    viewNote() {
      this.$emit('viewNote',this.$props.nid);
    }
  }
}
</script>