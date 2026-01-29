'use client';

import Lottie from 'lottie-react';
import { motion } from 'framer-motion';

// Placeholder animation data - usually imported from a JSON file
const scrollAnimation = {
  v: "5.7.4",
  fr: 60,
  ip: 0,
  op: 60,
  w: 100,
  h: 100,
  nm: "Scroll Down",
  ddd: 0,
  assets: [],
  layers: [{
    ddd: 0,
    ind: 1,
    ty: 4,
    nm: "Arrow",
    sr: 1,
    ks: {
      o: { a: 0, k: 100, ix: 11 },
      r: { a: 0, k: 0, ix: 10 },
      p: { a: 1, k: [{ i: { x: 0.833, y: 0.833 }, o: { x: 0.167, y: 0.167 }, t: 0, s: [50, 20, 0], to: [0, 20, 0], ti: [0, -20, 0] }, { i: { x: 0.833, y: 0.833 }, o: { x: 0.167, y: 0.167 }, t: 30, s: [50, 60, 0], to: [0, -20, 0], ti: [0, 20, 0] }, { t: 60, s: [50, 20, 0] }], ix: 2 },
      a: { a: 0, k: [0, 0, 0], ix: 1 },
      s: { a: 0, k: [100, 100, 100], ix: 6 }
    },
    ao: 0,
    shapes: [{
      ty: "gr",
      it: [{
        d: 1,
        ty: "el",
        s: { a: 0, k: [10, 10], ix: 2 },
        p: { a: 0, k: [0, 0], ix: 3 },
        nm: "Circle",
        mn: "ADBE Vector Shape - Ellipse",
        hd: false
      }, {
        ty: "fl",
        c: { a: 0, k: [1, 1, 1, 1], ix: 4 },
        o: { a: 0, k: 100, ix: 5 },
        r: 1,
        bm: 0,
        nm: "Fill 1",
        mn: "ADBE Vector Graphic - Fill",
        hd: false
      }],
      nm: "Group 1",
      np: 2,
      cix: 2,
      bm: 0,
      ix: 1,
      mn: "ADBE Vector Group",
      hd: false
    }],
    ip: 0,
    op: 60,
    st: 0,
    bm: 0
  }]
};

export function ScrollLottie() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 1 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 w-12 h-12 pointer-events-none"
    >
      <Lottie animationData={scrollAnimation} loop={true} />
    </motion.div>
  );
}
