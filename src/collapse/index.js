import { provide, reactive } from 'vue';
import { createNamespace } from '../utils';
import { BORDER_TOP_BOTTOM } from '../utils/constant';

const [createComponent, bem] = createNamespace('collapse');

export const COLLAPSE_KEY = 'vanCollapse';

export default createComponent({
  props: {
    accordion: Boolean,
    modelValue: [String, Number, Array],
    border: {
      type: Boolean,
      default: true,
    },
  },

  emits: ['change', 'update:modelValue'],

  setup(props, { emit, slots }) {
    const children = reactive([]);

    const toggle = (name, expanded) => {
      const { accordion, modelValue } = props;

      if (accordion) {
        if (name === modelValue) {
          name = '';
        }
      } else if (expanded) {
        name = modelValue.concat(name);
      } else {
        name = modelValue.filter((activeName) => activeName !== name);
      }

      emit('change', name);
      emit('update:modelValue', name);
    };

    const isExpanded = (name) => {
      const { accordion, modelValue } = props;

      if (
        !accordion &&
        !Array.isArray(modelValue) &&
        process.env.NODE_ENV !== 'production'
      ) {
        console.error(
          '[Vant] Collapse: type of prop "modelValue" should be Array'
        );
        return;
      }

      return accordion ? modelValue === name : modelValue.indexOf(name) !== -1;
    };

    provide(COLLAPSE_KEY, {
      toggle,
      children,
      isExpanded,
    });

    return () => (
      <div class={[bem(), { [BORDER_TOP_BOTTOM]: props.border }]}>
        {slots.default?.()}
      </div>
    );
  },
});