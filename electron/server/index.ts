import groupHelper from "./helper/groupHelper";

export default {
    start() {
        console.log('Server started');
        const object = {
            ...groupHelper
        };
        for (const key in object) {
            if (object.hasOwnProperty(key)) {
                (object as any)[key]();
            }
        }
    }
}