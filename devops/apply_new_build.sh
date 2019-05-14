#!/usr/bin/env bash
BUILD=build
NEW_BUILD=new-build
if [[ -d "$NEW_BUILD" ]]; then
  if [[ -d "$BUILD" ]]; then
      rm -r ${BUILD};
  fi
mv ${NEW_BUILD} ${BUILD};
fi
rm apply_new_build.sh
