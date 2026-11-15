import { describe, expect, it } from 'vitest';
import type { CableAnchors } from './cable-anchors.type';
import { buildCableRoutes } from './build-cable-routes';

const DESK_DEPTH = 0.9;
const WORLD = { obstacles: [], floorY: -0.75 };
const BACK = { x: 0, y: 0, z: -1 };
const anchors: CableAnchors = {
  keyboard: { position: { x: 0, y: 0.01, z: 0.2 }, exit: BACK },
  'pc-tower': { position: { x: 0.35, y: 0.06, z: -0.36 }, exit: BACK },
  laptop: { position: { x: -0.7, y: 0.22, z: 0 }, exit: { x: -1, y: 0, z: 0 } },
  phone: { position: { x: 0.7, y: 0.26, z: 0 }, exit: { x: 0, y: -1, z: 0 } },
  'power-strip': { position: { x: 0, y: 0.035, z: -0.4 }, exit: { x: 0, y: 1, z: 0 } },
};

describe('buildCableRoutes', () => {
  it('starts and ends inside the device sockets', () => {
    const [route] = buildCableRoutes([{ from: 'keyboard', to: 'pc-tower' }], anchors, DESK_DEPTH, WORLD);

    expect(route.points.at(0)).toEqual(anchors.keyboard?.position);
    expect(route.points.at(-1)).toEqual(anchors['pc-tower']?.position);
    expect(route.points.length).toBeGreaterThan(8);
  });

  it('leaves each device straight along its connector, like a plug', () => {
    const [route] = buildCableRoutes([{ from: 'laptop', to: 'power-strip' }], anchors, DESK_DEPTH, WORLD);
    const [laptopPlug] = route.plugs;

    expect(laptopPlug.tip.x).toBeLessThan(laptopPlug.socket.x);
    expect(laptopPlug.tip.y).toBeCloseTo(laptopPlug.socket.y);
    expect(route.points[1]).toEqual(laptopPlug.tip);
  });

  it('gives each cable its own power strip socket', () => {
    const routes = buildCableRoutes(
      [
        { from: 'laptop', to: 'power-strip' },
        { from: 'phone', to: 'power-strip' },
      ],
      anchors,
      DESK_DEPTH,
      WORLD,
    );
    const socketXs = routes.map((route) => route.points.at(-1)?.x);

    expect(new Set(socketXs).size).toBe(2);
  });

  it('drops a desk-back cable behind the desk, under the device', () => {
    const [route] = buildCableRoutes([{ from: 'phone', to: 'desk-back' }], anchors, DESK_DEPTH, WORLD);
    const end = route.points.at(-1);

    expect(end?.x).toBe(anchors.phone?.position.x);
    expect(end?.y).toBeLessThan(0);
    expect(end?.z).toBeLessThan(-DESK_DEPTH / 2);
  });

  it('skips cables whose device is not on the desk', () => {
    expect(buildCableRoutes([{ from: 'webcam', to: 'pc-tower' }], anchors, DESK_DEPTH, WORLD)).toEqual([]);
  });
});
