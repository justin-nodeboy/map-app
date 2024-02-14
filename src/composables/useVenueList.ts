import {ref} from "vue";
const sidebarVisible = ref(false);
export function useVenueList() {

    const levelColour = (level: string) => {
        if (level === "Blue") {
            return "#0d47a1";
        } else if (level === "Gold") {
            return "#FFD700";
        } else {
            return "#E5E4E2";
        }
    }

    return {
        sidebarVisible,
        levelColour
    }
}