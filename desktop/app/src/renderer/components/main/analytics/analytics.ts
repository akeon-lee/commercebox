/**
 *  This script file will handle all javascript needed for the analytics
 *  section of the application.
 */

namespace Analytics {
    class Analytics extends Components {
        constructor(name: string) {
            super();
            this.component.name = name;
            this.render();
        }

        private render = async (): Promise<void> => {
            const { name } = this.component;
            const component = await this.generateComponent(name, '#includes', 'main');
            if (component.status) {
                // set/update the global state object
                const { element } = component;
                const assemble: any = {};
                assemble[name] = element;
                state.assignToComponents(assemble);
            }
        }
    }
    new Analytics('analytics');
}
