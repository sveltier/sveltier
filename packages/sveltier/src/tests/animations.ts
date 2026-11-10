import { expect } from 'vitest';

// Reading the animations that components start from script, in browser tests.

export type Frame = Record<string, string | number | null | undefined>;

/** Animations from script, not the CSS transitions of hover and focus. */
export const scripted = (): Animation[] =>
	document.getAnimations().filter((animation) => !(animation instanceof CSSTransition));

/**
 * The first frame of the element's running animation (or of its pseudo-element's), returned once
 * the animation has finished, so the element's box can be measured without its transform.
 */
export async function firstFrame(element: Element, pseudoElement?: string): Promise<Frame> {
	const running = () =>
		scripted().find((animation) => {
			const effect = animation.effect as KeyframeEffect;
			return (
				effect.target === element &&
				(effect.pseudoElement ?? undefined) === pseudoElement &&
				Number(effect.getTiming().duration) > 0
			);
		});
	await expect.poll(running).toBeDefined();
	const animation = running()!;
	const [frame] = (animation.effect as KeyframeEffect).getKeyframes();
	await animation.finished;
	return frame as Frame;
}

/** Waits two frames, long enough for an animation to have started. */
export const twoFrames = (): Promise<void> =>
	new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(() => done())));
