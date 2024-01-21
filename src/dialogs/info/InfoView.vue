<script setup lang="ts">

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  TransitionChild, TransitionRoot
} from "@headlessui/vue";
import {XMarkIcon} from "@heroicons/vue/24/outline";

const props = defineProps({
  meta: {
    type: Object,
    required: true
  },
  open: {
    type: Boolean,
    required: true
  },
  categories: {
    type: Object,
    required: true
  }
});

const emit = defineEmits({
  'show-image-modal': null,
  'close-list': null
})

const showImageModal = (image: string) => {
  emit('show-image-modal', image);
};

const closeTheList = () => {
  emit('close-list');
};
</script>

<template>
  <TransitionRoot as="template" :show="props.open">
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
                      <DialogTitle class="text-lg font-medium text-white">{{props.meta.name}}</DialogTitle>
                      <div class="ml-3 flex h-7 items-center">
                        <button type="button" class="rounded-md bg-[#0d47a1] text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-white" @click="closeTheList()">
                          <span class="sr-only">Close panel</span>
                          <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                    <div class="mt-1">
                      <p class="text-sm text-blue-300">
                        {{props.meta.description}}
                      </p>
                    </div>
                  </div>
                  <div class="relative h-60">
                    <img @click="showImageModal(`https://admin.bluebillboard.co.uk/images/locations/${props.meta.image}`)" class="absolute h-full w-full object-cover cursor-pointer" :src="`https://admin.bluebillboard.co.uk/images/locations/${props.meta.image}`" alt="" />
                  </div>
                  <div class="relative flex-1 py-6 px-4 sm:px-6 w-full">
                    <!-- Replace with your content -->
                    <div class="absolute inset-0 py-6 px-4 sm:px-6">
                      <div class="h-full w-full" aria-hidden="true">
                        <p class="text-black-300 text-3xl">City: {{props.meta.city}}</p>
                        <p class="text-black-300 text-3xl mt-2">Type: {{props.meta.type}}</p>
                        <p class="text-black-300 text-3xl mt-2">Footfall/Month: {{props.meta.footfallPerMonth.toLocaleString()}}</p>
                        <p class="text-black-300 text-3xl mt-2">Total Screens: {{props.meta.screenCount}}</p>
                        <p class="text-black-300 text-2xl mt-10">Rate Card</p>
                        <div class="w-full mt-2">
                          <TabGroup>
                            <TabList class="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                              <Tab
                                  v-for="category in Object.keys(categories)"
                                  as="template"
                                  :key="category"
                                  v-slot="{ selected }"
                              >
                                <button
                                    :class="[
              'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
              'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
              selected
                ? 'bg-[#0d47a1] text-white shadow'
                : 'text-blue-400 hover:bg-white/[0.12] hover:text-[#0d47a1]',
            ]"
                                >
                                  {{ category }}
                                </button>
                              </Tab>
                            </TabList>

                            <TabPanels class="mt-2">
                              <TabPanel
                                  v-for="(posts, idx) in Object.values(categories)"
                                  :key="idx"
                                  :class="[
            'rounded-xl bg-white p-3',
            'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
          ]"
                              >
                                <ul>
                                  <li
                                      v-for="(post, i) in posts"
                                      :key="i"
                                      class="relative rounded-md p-3 hover:bg-gray-100"
                                  >
                                    <h3 class="text-xl font-medium leading-5">
                                      Frequency: {{ post.rateDescription }}
                                    </h3>
                                    <ul
                                        v-if="post.isRatePerScreen"
                                        class="mt-2 flex space-x-1 text-lg font-normal leading-4 text-gray-500"
                                    >
                                      <li>£{{ post.rateCostAllScreens }}</li>
                                      <li>-</li>
                                      <li>includes all {{props.meta.screenCount}} screens,</li>
                                      <li>per month</li>
                                      <li>+ VAT</li>
                                    </ul>

                                    <ul
                                        v-if="post.isRatePerScreen"
                                        class="mt-2 flex space-x-1 text-lg font-normal leading-4 text-gray-500"
                                    >
                                      <li>£{{ post.rateCostPerScreen }}</li>
                                      <li>-</li>
                                      <li>per screen,</li>
                                      <li>per month</li>
                                      <li>+ VAT</li>
                                    </ul>

                                    <ul
                                        v-if="!post.isRatePerScreen"
                                        class="mt-2 flex space-x-1 text-lg font-normal leading-4 text-gray-500"
                                    >
                                      <li>£{{ post.rateCostPerScreen }}</li>
                                      <li>-</li>
                                      <li>per month</li>
                                      <li>+ VAT</li>
                                    </ul>
                                  </li>
                                </ul>
                              </TabPanel>
                            </TabPanels>
                          </TabGroup>
                        </div>
                      </div>
                    </div>
                    <!-- /End replace -->
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<style scoped>

</style>