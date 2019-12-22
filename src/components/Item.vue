<template>
  <q-item clickable v-ripple :class="{'bg-pink-1 text-pink-5': item.done}">

    <q-item-section avatar>
      <q-avatar>
        <img v-if="item.image" :src="item.image">
        {{ item.title[0] }}
      </q-avatar>
    </q-item-section>

    <q-item-section @click="viewItem">
      <q-item-label>{{ item.title }}</q-item-label>
      <q-item-label caption>{{ item.startDate }}<span v-if="item.endDate"> ~ {{item.endDate}}</span></q-item-label>
    </q-item-section>

    <q-item-section top side>
      <div>
        <q-btn size="12px" flat dense round icon="edit" @click="edit=true" />
        <q-btn size="12px" flat dense round icon="done" @click="toggleDone" :class="{ 'text-pink-5' : item.done}" />
        <q-btn size="12px" flat dense round icon="delete" @click="deleteCnfm=true" />
      </div>
    </q-item-section>

    <q-dialog v-model="deleteCnfm">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div>Delete {{ item.title }} ?</div>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn unelevated color="primary" label="Delete" @click="deleteItem" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="edit">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div>Edit Item</div>
        </q-card-section>

        <q-card-section>
          <q-input 
            dense 
            v-model="item.title" 
            label="Title" 
            autofocus 
          />

          <!--
          <q-uploader
            label="Upload Image"
            square
            flat
            class="q-my-sm"
          />
          -->

          <q-input
            dense
            autogrow
            v-model="item.content" label="Content"
          />
          <q-input 
            dense 
            v-model="item.image" 
            label="Image" 
          />
          <q-input
            dense
            v-model="item.url" label="URL"
          />
          <q-input dense label="Start Date" v-model="item.startDate" mask="date">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="item.startDate" @input="() => $refs.qDateProxy.hide()" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input dense label="End Date" v-model="item.endDate" mask="date">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="item.endDate" @input="() => $refs.qDateProxy.hide()" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <div>
            <q-toggle v-model="item.done" />
            <span v-if="item.done">Done</span>
            <span v-else>Undone</span>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn unelevated color="primary" label="Save Item" @click="updateItem" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-item>
</template>

<script>
import { db } from "boot/firebase";
import Avatar from './Avatar'
export default {
  props: ['item'],
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
    deleteItem() {
      db.collection('items').doc(this.$props.item.id).delete()
      .then(
        this.deleteCnfm=false
      )
    },
    updateItem() {
      db.collection('items').doc(this.$props.item.id).update(this.item)
      .then(
        this.edit=false
      )
    },
    viewItem() {
      this.$emit('viewItem',this.$props.item.id);
    },
    toggleDone() {
      db.collection('items').doc(this.$props.item.id).update({
        done: !this.item.done
      })
    }
  }
}
</script>