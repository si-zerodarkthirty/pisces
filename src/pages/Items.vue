<template>
  <q-page>
    <q-list>
      <q-item-label header>{{ list.name }}</q-item-label>
      <q-item clickable v-ripple>

        <q-item-section avatar>
          <q-avatar color="primary" text-color="white" icon="add"></q-avatar>
        </q-item-section>

        <q-item-section @click="addItem=true">
          <q-item-label>New Item</q-item-label>
        </q-item-section>

      </q-item>
      <Item 
        v-for="item in orderBy(items,'done','createdAt')" 
        :key="item.id" 
        :item="item" 
        @viewItem="viewItem"
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

    <q-dialog v-model="addItem">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div>New Item</div>
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
          <q-btn flat label="Add Item" @click="saveItem" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script>
import { auth,db } from 'boot/firebase'
import Item from '../components/Item'
import Vue2Filters from 'vue2-filters'
export default {
  components: {
    Item
  },
  created() {
    auth.onAuthStateChanged((user) => {
      this.user = user
    })
  },
  data() {
    return {
      list: {},
      items: [],
      user: {},
      addItem: false,
      item: {
        done: false
      },
      right: false,
      selected: {}
    }
  },
  firestore() {
    return {
      list: db.collection('lists').doc(this.$route.params.id),
      items: db.collection('items').where('lid','==',this.$route.params.id)
    }
  },
  methods: {
    saveItem() {
      this.item.createdAt = new Date()
      this.item.lid= this.$route.params.id
      this.item.uid= this.user.uid
      db.collection('items').add(this.item).then(
        this.addItem = false
      )
    },
    viewItem(id) {
      db.collection('items').doc(id).onSnapshot(item => {
        this.selected = item.data()
      })
      this.right = true
    }
  },
  mixins: [Vue2Filters.mixin]
}
</script>