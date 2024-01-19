<script setup lang="ts">

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild, TransitionRoot
} from "@headlessui/vue";
import {XMarkIcon} from "@heroicons/vue/24/outline";

interface LocationData {
  name: string;
  image: string;
  // Add other properties if necessary
}

const props = defineProps({
  locationData: {
    type: Array<LocationData>,
    required: true
  },
  listOpen: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits({
  'show-modal-table': null,
  'show-image-modal': null,
  'close-list': null
})

const showImageModal = (image: string) => {
  emit('show-image-modal', image);
};

const showModalTable = (location: any) => {
  emit('show-modal-table', location);
};

const closeTheList = () => {
  emit('close-list');
};

</script>

<template>
    <TransitionRoot as="template" :show="props.listOpen">
      <Dialog as="div" class="relative z-20">
        <div class="fixed inset-0" />

        <div class="fixed inset-0 overflow-hidden">
          <div class="absolute inset-0 overflow-hidden">
            <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <TransitionChild as="template" enter="transform transition ease-in-out duration-500 sm:duration-700" enter-from="translate-x-full" enter-to="translate-x-0" leave="transform transition ease-in-out duration-500 sm:duration-700" leave-from="translate-x-0" leave-to="translate-x-full">
                <DialogPanel class="pointer-events-auto w-screen max-w-3xl">
                  <div class="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div class="bg-[#0d47a1] py-6 px-4 sm:px-6">
                      <div class="flex items-center justify-between">
                        <DialogTitle class="text-lg font-medium text-white">All Locations</DialogTitle>
                        <div class="ml-3 flex h-7 items-center">
                          <button type="button" class="rounded-md bg-[#0d47a1] text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-white" @click="closeTheList()">
                            <span class="sr-only">Close panel</span>
                            <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <table class="table-fixed border-collapse border border-slate-400 m-2 ml-2">
                      <thead>
                      <tr>
                        <th class="border border-slate-300 p-2">Image</th>
                        <th class="border border-slate-300 p-2">Name</th>
                        <th class="border border-slate-300 p-2">Details</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="(l, index) in props.locationData" :key="index">
                        <td class="border border-slate-300 p-2"><img @click="showImageModal(`https://admin.bluebillboard.co.uk/images/locations/${l.image}`)" class="h-28 w-28 object-cover cursor-pointer" :src="`https://admin.bluebillboard.co.uk/images/locations/${l.image}`" alt="" /></td>
                        <td class="border border-slate-300 p-2">{{l.name}}</td>
                        <td class="border border-slate-300 p-2">
                          <a class="cursor-pointer text-blue-500" @click="showModalTable(l)">View</a>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>

                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
</template>
