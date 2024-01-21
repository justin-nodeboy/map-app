<script setup lang="ts">
import {ref} from "vue";
import { FilterMatchMode } from 'primevue/api';

interface SelectedVenues {
  selected: any[];
}

interface Plan {
  name: string;
  description: string;
  price: number;
  feature1: string;
  features: string[];
}

const isCharity = ref<boolean>(false);
const isPartner = ref<boolean>(false);
const isChamber = ref<boolean>(false);
const isCircle = ref<boolean>(false);
const totalRate = ref(0);
const op = ref();
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const props = defineProps({
  openWizard: {
    type: Boolean,
    required: true
  },
  venues: {
    type: Array,
    required: true
  }
});

const active = ref<number>(0);
const duration = ref<number>(1);
const items = ref([
  {
    label: 'Choose Venues'
  },
  {
    label: 'Additional Information'
  },
  {
    label: 'Quote'
  }
]);

const chambers = ["Worthing & Adur Chamber of Commerce", "Sussex Chamber of Commerce", "Brighton Chamber of Commerce", "Worthing Business Circle", "HHBA", "Horsham & Billingshurst Chamber of Commerce"];
const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const selectedVenues = ref<SelectedVenues>();

const emit = defineEmits({
  'close-wizard': null
});

const isVenueInSelected = (venueId: string) => {
  if (!selectedVenues.value) return false;
  return selectedVenues.value?.selected.find((v: any) => v.id === venueId);
}

const addVenue = (venue: any) => {
  selectVenue(venue);
}

const selectVenue = (venue: any) => {
  if (selectedVenues.value) {
    const index = selectedVenues.value?.selected.findIndex((x: any) => x.id === venue.id);
    if (index > -1) {
      selectedVenues.value?.selected.splice(index, 1);
    } else {
      selectedVenues.value?.selected.push(venue);
    }
  } else {
    selectedVenues.value = {
      selected: [venue]
    }
  }
}

const plans = ref<Plan[]>([
  {
    name: "Starter",
    description: "Gets you on screen for the lowest price",
    price: 0,
    feature1: "8-10 plays/screen/hour",
    features: []
  },
  {
    name: "Optimal",
    description: "For businesses that want more exposure",
    price: 0,
    feature1: "18-20 plays/screen/hour",
    features: []
  },
  {
    name: "Enhanced",
    description: "For businesses that want maximum exposure",
    price: 0,
    feature1: "36-40 plays/screen/hour",
    features: []
  },
]);

const resetCalculations = () => {
  plans.value[0].features = [];
  plans.value[1].features = [];
  plans.value[2].features = [];

  plans.value[0].price = 0;
  plans.value[1].price = 0;
  plans.value[2].price = 0;
  totalRate.value = 0;
}

const calculateQuote = () => {
  resetCalculations();

  selectedVenues.value?.selected.forEach((venue: any) => {
    if (venue.isRatePerScreen) {
      totalRate.value += venue.rate * venue.screenCount - 50;
    } else {
      totalRate.value += venue.rate;
    }
  });

  // Apply Discounts
  // Apply Charity
  if (isCharity.value) {
    totalRate.value = totalRate.value - (totalRate.value * 0.25);
    plans.value[0].features.push("Includes Charity discount of 25%");
    plans.value[1].features.push("Includes Charity discount of 25%");
    plans.value[2].features.push("Includes Charity discount of 25%");
  }
  // Apply Partner
  if (isPartner.value) {
    totalRate.value = totalRate.value - (totalRate.value * 0.25);
    plans.value[0].features.push("Includes Partner discount of 25%");
    plans.value[1].features.push("Includes Partner discount of 25%");
    plans.value[2].features.push("Includes Partner discount of 25%");
  }
  // Apply Chamber
  if (isChamber.value) {
    totalRate.value = totalRate.value - (totalRate.value * 0.25);
    plans.value[0].features.push("Includes Chamber discount of 25%");
    plans.value[1].features.push("Includes Chamber discount of 25%");
    plans.value[2].features.push("Includes Chamber discount of 25%");
  }
  // Apply Circle
  if (isCircle.value) {
    totalRate.value = totalRate.value - (totalRate.value * 0.25);
    plans.value[0].features.push("Includes WBC discount of 25%");
    plans.value[1].features.push("Includes WBC discount of 25%");
    plans.value[2].features.push("Includes WBC discount of 25%");
  }
  // Apply MultiSite
  if (selectedVenues.value && selectedVenues.value?.selected.length >= 2) {
    totalRate.value = totalRate.value - (totalRate.value * 0.10);
    plans.value[0].features.push("Includes Multi Site discount of 10%");
    plans.value[1].features.push("Includes Multi Site discount of 10%");
    plans.value[2].features.push("Includes Multi Site discount of 10%");
  }
  // Apply MultiMonth
  if (duration.value >= 3) {
    totalRate.value = totalRate.value - (totalRate.value * 0.10);
    plans.value[0].features.push("Includes Multi Month discount of 10%");
    plans.value[1].features.push("Includes Multi Month discount of 10%");
    plans.value[2].features.push("Includes Multi Month discount of 10%");
  }

  plans.value[0].price = totalRate.value;
  plans.value[1].price = totalRate.value * 1.8;
  plans.value[2].price = totalRate.value * 3.8;

};

const toggle = (event: any) => {
  op.value.toggle(event);
}


const closeWizard = () => {
  emit('close-wizard');
};
</script>

<template>
  <Dialog v-model:visible="props.openWizard" modal header="Quote Wizard" :style="{ width: '70rem' }"
          style="max-height: 90vh; overflow-y: auto;" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" :closable="false">
    <div>
      <Steps v-model:activeStep="active" :model="items"/>
      <Card v-if="active === 0">
        <template #title> Choose your venues</template>
        <template #content>
          <DataTable :value="venues"
                     tableStyle="min-width: 50rem"
                     v-model:filters="filters"
                     filterDisplay="row"
                     :globalFilterFields="['name', 'city', 'type']"
          >
            <template #header>
              <div class="flex justify-content-end">
                    <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText class="ml-2" v-model="filters['global'].value" placeholder="Search (Name, Type or Location)" />
                    </span>
              </div>
            </template>
            <Column header="Image">
              <template #body="slotProps">
                <img :src="`https://admin.bluebillboard.co.uk/images/locations/${slotProps.data.image}`" :alt="slotProps.data.image"
                     class="w-20 shadow-2 border-round object-contain"/>
              </template>
            </Column>

            <Column field="name" header="Name"></Column>
            <Column field="type" header="Type"></Column>
            <Column field="city" header="City"></Column>

            <Column header="Action">
              <template #body="slotProps">
                <Button v-if="!isVenueInSelected(slotProps.data.id)" icon="pi pi-plus"
                        class="bg-blue-500 border-blue-500"
                        @click="addVenue(slotProps.data)"/>
                <Button v-if="isVenueInSelected(slotProps.data.id)" icon="pi pi-minus"
                        class="bg-red-500 border-red-500 p-button-rounded p-button-text hover:bg-red-600 hover:border-red-600"
                        @click="addVenue(slotProps.data)"/>
              </template>
            </Column>
          </DataTable>

        </template>
        <template #footer>
          <Button icon="pi pi-angle-right" @click="active = 1" label="Next"/>
        </template>
      </Card>
      <Card v-if="active === 1">
        <template #title> Additional information</template>
        <template #content>
          <div class="flex items-center">
            <Checkbox v-model="isCharity" name="isCharity" :binary="true"></Checkbox>
            <label class="leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight ml-2"
                   for="isCharity">Are you a registered charity?</label>
          </div>
          <div class="flex items-center mt-2">
            <Checkbox v-model="isPartner" name="isPartner" :binary="true"></Checkbox>
            <label class="leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight ml-2"
                   for="isPartner">Do you have a Blue Billboard screen?</label>
          </div>
          <div class="flex items-center mt-2">
            <Checkbox v-model="isChamber" name="isChamber" :binary="true"></Checkbox>
            <label class="leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight ml-2"
                   for="isChamber">Are you a member of an approved Chamber of Commerce (See list)?</label>
            <Avatar @click="toggle" icon="pi pi-info-circle" style="background-color: #0d47a1; color: #ffffff" shape="circle" class="ml-3" />
            <OverlayPanel appendTo="body" ref="op" class="surface-card shadow-2 border-round">
              <Card>
                <template #title> Approved Chambers & Group Discounts </template>
                <template #content>
                  <p v-for="(chamber, cIdx) in chambers" :key="cIdx">{{chamber}}</p>
                </template>
              </Card>
            </OverlayPanel>
          </div>
          <div class="flex items-center mt-2">
            <Dropdown v-model="duration" :options="months" placeholder="How Long is the campaign?"
                      class="w-full">
            </Dropdown>
            <label class="leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight ml-2"
                   for="isMultiMonth">Select the duration of your campaign.</label>
          </div>
        </template>
        <template #footer>
          <Button icon="pi pi-angle-left" class="mr-2" @click="active = 0" label="Back"/>
          <Button icon="pi pi-angle-right" @click="calculateQuote(); active = 2" label="Next"/>
        </template>
      </Card>

      <Card v-if="active === 2">
        <template #title> Quote</template>
        <template #content>
          <div class="flex justify-center items-center mt-10">
            <div v-for="(plan, index) in plans" :key="index" class="w-1/3 mx-4">
              <div class="bg-white shadow-md rounded-lg p-6 dark:bg-gray-900">
                <h2 class="text-2xl font-semibold mb-4">{{ plan.name }}</h2>
                <p class="text-gray-600 mb-4 dark:text-white">{{ plan.description }}</p>
                <div class="flex items-center justify-center mb-4">
                  <span class="text-4xl font-semibold">£{{ plan.price.toFixed(2) }}</span>
                  <span class="text-gray-600 ml-2 dark:text-white">/month + VAT</span>
                </div>
                <ul class="text-gray-600 dark:text-white">
                  <li class="mb-2">{{ plan.feature1 }}</li>
                  <li v-for="(f, i) in plan.features" class="mb-2" :key="i">{{ f }}</li>
                </ul>
              </div>
            </div>
          </div>
        </template>
        <template #footer>
          <Button icon="pi pi-angle-left" @click="active = 1" label="Back"/>
        </template>
      </Card>

    </div>

    <template #footer>
      <Button label="Done" icon="pi pi-times" @click="closeWizard" text/>
    </template>
  </Dialog>
</template>

<style scoped>
.custom-dialog-width {
  width: 700px; /* Adjust the width to your desired value */
}
</style>