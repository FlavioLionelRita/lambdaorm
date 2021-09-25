#!/usr/bin/env bash

IFS="," read -a databases <<< $1
for database in "${databases[@]}"
do
  rm -f "./../state/${database}-state.json"
done
rm -rf ./../data/*
rm -rf ./../dataForTest/*
rm -rf ./../__integration__/*
rm -rf ./../__unit__/*