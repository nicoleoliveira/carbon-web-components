/**
 * @license
 *
 * Copyright IBM Corp. 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { SVGTemplateResult } from 'lit-html';
import { html, svg, property, customElement, LitElement } from 'lit-element';
import CheckmarkOutline16 from '@carbon/icons/lib/checkmark--outline/16';
import Warning16 from '@carbon/icons/lib/warning/16';
import settings from 'carbon-components/es/globals/js/settings';
import spread from '../../globals/directives/spread';
import styles from './progress-indicator.scss';

const { prefix } = settings;

/**
 * State of progress step.
 */
export enum PROGRESS_STEP_STAT {
  /**
   * One for future execution.
   */
  QUEUED = 'queued',

  /**
   * One that is being executed now.
   */
  CURRENT = 'current',

  /**
   * Complete one.
   */
  COMPLETE = 'complete',

  /**
   * Invalid one.
   */
  INVALID = 'invalid',
}

/**
 * Icons, keyed by state.
 */
const icons = {
  [PROGRESS_STEP_STAT.QUEUED]: ({
    children,
    attrs = {},
  }: { children?: SVGTemplateResult; attrs?: { [key: string]: string } } = {}) =>
    svg`
      <svg ...="${spread(attrs)}">
        ${children}
        <path d="M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zm0 13c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z" />
      </svg>
    `,
  [PROGRESS_STEP_STAT.CURRENT]: ({
    children,
    attrs = {},
  }: { children?: SVGTemplateResult; attrs?: { [key: string]: string } } = {}) =>
    svg`
      <svg ...="${spread(attrs)}">
        ${children}
        <path d="M 7, 7 m -7, 0 a 7,7 0 1,0 14,0 a 7,7 0 1,0 -14,0" />
      </svg>
    `,
  [PROGRESS_STEP_STAT.COMPLETE]: CheckmarkOutline16,
  [PROGRESS_STEP_STAT.INVALID]: Warning16,
};

/**
 * Progress step.
 */
@customElement(`${prefix}-progress-step`)
class BXProgressStep extends LitElement {
  /**
   * `true` if the progress step should be disabled. Corresponds to the attribute with the same name.
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * The a11y text for the icon. Corresponds to `icon-label` attribute.
   */
  @property({ attribute: 'icon-label' })
  iconLabel!: string;

  /**
   * The primary progress label. Corresponds to `label-text` attribute.
   */
  @property({ attribute: 'label-text' })
  labelText!: string;

  /**
   * The secondary progress label. Corresponds to `secondary-label-text` attribute.
   */
  @property({ attribute: 'secondary-label-text' })
  secondaryLabelText!: string;

  /**
   * The progress state. Corresponds to the attribute with the same name.
   */
  @property()
  state = PROGRESS_STEP_STAT.QUEUED;

  /**
   * `true` if the progress step should be vertical. Corresponds to the attribute with the same name.
   */
  @property({ type: Boolean, reflect: true })
  vertical = false;

  connectedCallback() {
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'listitem');
    }
    super.connectedCallback();
  }

  updated(changedProperties) {
    if (changedProperties.has('disabled')) {
      this.setAttribute('aria-disabled', String(Boolean(this.disabled)));
    }
  }

  render() {
    const { iconLabel, labelText, secondaryLabelText, state } = this;
    return html`
      ${icons[state]({
        class: {
          [PROGRESS_STEP_STAT.INVALID]: `${prefix}--progress__warning`,
        }[state],
        children: !iconLabel ? undefined : svg`<title>${iconLabel}</title>`,
      })}
      <slot>
        <p role="button" class="${prefix}--progress-label" tabindex="0" aria-describedby="label-tooltip">${labelText}</p>
      </slot>
      <slot name="secondary-label">
        ${!secondaryLabelText
          ? undefined
          : html`
              <p class="${prefix}--progress-optional">${secondaryLabelText}</p>
            `}
      </slot>
      <span class="${prefix}--progress-line"></span>
    `;
  }

  static styles = styles;
}

export default BXProgressStep;