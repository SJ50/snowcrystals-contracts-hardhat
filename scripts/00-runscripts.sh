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

# echo "running 01-snow-setup.ts..."
# while true
#     do  
#     hh run --network $NETWORK scripts/01-snow-setup.ts 
#     if [ $? == 0 ]; then
#         break
#     fi
# done

# echo "running 02-snow-tax_office-setup.ts..."
# while true
#     do  
#     hh run --network $NETWORK scripts/02-snow-tax_office-setup.ts
#     if [ $? == 0 ]; then
#         break
#     fi
# done

# echo "running 03-glcr-setup.ts..."
# while true
#     do  
#     hh run --network $NETWORK scripts/03-glcr-setup.ts
#     if [ $? == 0 ]; then
#         break
#     fi
# done

echo "running 04-glcr-tax_office-setup.ts..."
while true
    do  
    hh run --network $NETWORK scripts/04-glcr-tax_office-setup.ts
    if [ $? == 0 ]; then
        break
    fi
done

echo "running 05-sbond-setup.ts..."
while true
    do  
    hh run --network $NETWORK scripts/05-sbond-setup.ts
    if [ $? == 0 ]; then
        break
    fi
done

echo "running 06-boardroom-setup.ts..."
while true
    do  
    hh run --network $NETWORK scripts/06-boardroom-setup.ts
    if [ $? == 0 ]; then
        break
    fi
done

echo "running 07-all-oracle-setup.ts..."
while true
    do  
    hh run --network $NETWORK scripts/07-all-oracle-setup.ts
    if [ $? == 0 ]; then
        break
    fi
done

echo "running 08-treasury-setup.ts..."
while true
    do  
    hh run --network $NETWORK scripts/08-treasury-setup.ts
    if [ $? == 0 ]; then
        break
    fi
done

echo "running 09-genesispool-setup.ts..."
while true
    do  
    hh run --network $NETWORK scripts/09-genesispool-setup.ts
    if [ $? == 0 ]; then
        break
    fi
done

echo "running 10-glcr-rewardpool-setup.ts..."
while true
    do  
    hh run --network $NETWORK scripts/10-glcr-rewardpool-setup.ts
    if [ $? == 0 ]; then
        break
    fi
done

echo "running 11-zap-setup.ts..."
while true
    do  
    hh run --network $NETWORK scripts/11-zap-setup.ts
    if [ $? == 0 ]; then
        break
    fi
done

echo "running 12-dao-snow-rebate-setup.ts..."
while true
    do  
    hh run --network $NETWORK scripts/12-dao-snow-rebate-setup.ts
    if [ $? == 0 ]; then
        break
    fi
done

echo "running 13-dao-glcr-rebate-setup.ts..."
  while true
    do  
    hh run --network $NETWORK scripts/13-dao-glcr-rebate-setup.ts
      if [ $? == 0 ]; then
        break
    fi
done

echo "running 14-dev-snow-rebate-setup.ts..."
  while true
    do  
    hh run --network $NETWORK scripts/14-dev-snow-rebate-setup.ts
    if [ $? == 0 ]; then
        break
    fi
done

echo "running 15-dev-glcr-rebate-setup.ts..."
  while true
    do  
    hh run --network $NETWORK scripts/15-dev-glcr-rebate-setup.ts
    if [ $? == 0 ]; then
        break
    fi
done
