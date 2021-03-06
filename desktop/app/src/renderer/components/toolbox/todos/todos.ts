/**
 *  This script file will handle all javascript needed for the todos
 *  section of the application.
 */

namespace ToDos {
    class ToDos extends Component {
        constructor(name: string) {
            super(name);
            this.render();
        }

        private render = (): void => {
            this.generateComponent(this.name, '#includes', 'toolbox', state, router);
        }
    }
    new ToDos('todos');
}
