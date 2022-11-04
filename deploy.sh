#! /bin/bash
#!/usr/bin/env bash

set -uo pipefail
NETWORK=$1
shift $#
#
# Improve error handling - line number and script file
function error_trap {
    if [ -o errexit ]; then
        line=$(caller | cut -d " " -f 1)
        script=$(caller | cut -d " " -f 2)
        (
            set +e
            echo "Error at ${line} in ${script}:"
        )
    fi
}
trap error_trap ERR

echo "network is $NETWORK"

for f in deploy/*; do
    echo "running $f..."
    while true; do
        tag=${f##*-}   ## means remove largest matching string from the beginning
        tag=${tag%%.*} ## means remove largetst matching end part including matching string
        hh deploy --network $NETWORK --tags $tag
        if [ $? == 0 ]; then
            break
        fi
    done
done

# while true; do
#     hh deploy --network $NETWORK --tags mocks
#     if [ $? == 0 ]; then
#         break
#     fi
# done

# while true; do
#     hh deploy --network $NETWORK --tags snow
#     if [ $? == 0 ]; then
#         break
#     fi
# done

# while true; do
#     hh deploy --network $NETWORK --tags sbond
#     if [ $? == 0 ]; then
#         break
#     fi
# done

# while true; do
#     hh deploy --network $NETWORK --tags glcr
#     if [ $? == 0 ]; then
#         break
#     fi
# done

# while true; do
#     hh deploy --network $NETWORK --tags boardroom
#     if [ $? == 0 ]; then
#         break
#     fi
# done

# while true; do
#     hh deploy --network $NETWORK --tags lp
#     if [ $? == 0 ]; then
#         break
#     fi
# done

# while true; do
#     hh deploy --network $NETWORK --tags SeigniorageOracle
#     if [ $? == 0 ]; then
#         break
#     fi
# done
# while true; do
#     hh deploy --network $NETWORK --tags snowOracle
#     if [ $? == 0 ]; then
#         break
#     fi
# done
# while true; do
#     hh deploy --network $NETWORK --tags glcrOracle
#     if [ $? == 0 ]; then
#         break
#     fi
# done
# while true; do
#     hh deploy --network $NETWORK --tags usdcOracle
#     if [ $? == 0 ]; then
#         break
#     fi
# done
# while true; do
#     hh deploy --network $NETWORK --tags treasury
#     if [ $? == 0 ]; then
#         break
#     fi
# done

# while true; do
#     hh deploy --network $NETWORK --tags glcrRewardPool
#     if [ $? == 0 ]; then
#         break
#     fi
# done

# while true; do
#     hh deploy --network $NETWORK --tags snowGenesisRewardPool
#     if [ $? == 0 ]; then
#         break
#     fi
# done
# while true; do
#     hh deploy --network $NETWORK --tags snowNode
#     if [ $? == 0 ]; then
#         break
#     fi
# done
# while true; do
#     hh deploy --network $NETWORK --tags glcrNode
#     if [ $? == 0 ]; then
#         break
#     fi
# done
# while true; do
#     hh deploy --network $NETWORK --tags taxOffice
#     if [ $? == 0 ]; then
#         break
#     fi
# done
# while true; do
#     hh deploy --network $NETWORK --tags wrappedRouter
#     if [ $? == 0 ]; then
#         break
#     fi
# done
# while true; do
#     hh deploy --network $NETWORK --tags zap
#     if [ $? == 0 ]; then
#         break
#     fi
# done
# while true; do
#     hh deploy --network $NETWORK --tags daoSnowRebateTreasury
#     if [ $? == 0 ]; then
#         break
#     fi
# done

# while true; do
#     hh deploy --network $NETWORK --tags daoGlcrRebateTreasury
#     if [ $? == 0 ]; then
#         break
#     fi
# done
# while true; do
#     hh deploy --network $NETWORK --tags devSnowRebateTreasury
#     if [ $? == 0 ]; then
#         break
#     fi
# done

# while true; do
#     hh deploy --network $NETWORK --tags devGlcrRebateTreasury
#     if [ $? == 0 ]; then
#         break
#     fi
# done
