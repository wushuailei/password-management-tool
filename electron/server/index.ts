import userHelper from "./helper/userHelper";
import groupHelper from "./helper/groupHelper";
import textItemHelper from "./helper/textItemHelper";
import electronHelper from "./helper/electronHelper";

export default {
    start() {
        console.log('Server started');
        const object = {
            ...electronHelper,
            ...userHelper,
            ...groupHelper,
            ...textItemHelper
        };
        for (const key in object) {
            if (object.hasOwnProperty(key)) {
                (object as any)[key]();
            }
        }
    }
}