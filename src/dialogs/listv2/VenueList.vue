<script setup lang="ts">
import {useVenueList} from "@/composables/useVenueList";

const {sidebarVisible, levelColour} = useVenueList();
interface LocationData {
  name: string;
  image: string;
  level: string;
  city: string;
  type: string;
  footfallPerMonth: number;
  screenCount: number;
  isRatePerScreen: boolean;
  rate: number;
  location: any;
  // Add other properties if necessary
}
const props = defineProps({
  locationData: {
    type: Array<any>,
    required: true
  },
});

const emit = defineEmits({
  'set-location': null
})

const goToLocation = (location: any) => {
  const l = JSON.parse(JSON.stringify(location));
  emit('set-location', l);
};
</script>

<template>
  <sidebar v-model:visible="sidebarVisible" header="Venues" position="right"
           class="w-full" :pt="{title: {class: 'text-white dark:text-black'}, closeIcon: {class:'text-white dark:text-black'}}">
    <DataView :value="locationData" data-key="id">
      <template #list="slotProps">
        <div class="grid grid-nogutter divide-y divide-blue-200">
          <div v-for="(item, index) in slotProps.items" :key="index" class="w-full p-3">
            <div class="flex flex-col sm:flex-row justify-between items-center xl:items-start flex-1 gap-4 p-3" :class="{ 'border-t border-surface-200 dark:border-surface-700': index !== 0 }"
                 :style="`background-color:${levelColour(item.level)}`">
              <div class="relative">
                <avatar :image="`${item.image}`"
                        size="xlarge"
                        shape="circle"
                        class="block"
                >
                </avatar>
              </div>
              <div class="flex flex-col sm:flex-row justify-between items-center xl:items-start flex-1 gap-4">
                <div class="flex flex-col items-center sm:items-start gap-3">
                  <div>
                    <span class="font-medium text-secondary text-sm" :style="`color:${item.level === 'Blue' ? 'white' : 'black'}`">{{ item.level }}</span>
                    <div class="text-lg font-medium text-900 mt-2" :style="`color:${item.level === 'Blue' ? 'white' : 'black'}`">{{ item.name }}</div>
                    <span class="font-medium text-secondary text-sm block" :style="`color:${item.level === 'Blue' ? 'white' : 'black'}`">{{ item.type }}</span>
                  </div>
                </div>
                <div class="flex sm:flex-col items-center sm:items-end">
<!--                  <span class="text-xl font-semibold text-900"-->
<!--                        :style="`color:${item.level === 'Blue' ? 'white' : 'black'}`">-->
<!--                    from £{{item.isRatePerScreen ? `${(item.rate * item.screenCount) - 50}`: `${item.rate}`}}/month-->
<!--                  </span>-->
<!--                  <span class="font-medium text-secondary text-sm" :style="`color:${item.level === 'Blue' ? 'white' : 'black'}`">+ VAT</span>-->
                  <div class="flex gap-2 mt-2">
                    <Button style="'background-color: #0d47a1'" size="small" @click="goToLocation(item.location)" icon="pi pi-eye" rounded></Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </DataView>
  </sidebar>
</template>

<style scoped>

</style>