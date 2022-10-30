#! /bin/bash

while true
    do  
    hh deploy --network cronosTestnet --tags mocks
    if [ $? == 0 ]; then
        break
    fi
done

while true
    do  
    hh deploy --network cronosTestnet --tags snow
    if [ $? == 0 ]; then
        break
    fi
done

while true
    do  
    hh deploy --network cronosTestnet --tags sbond
    if [ $? == 0 ]; then
        break
    fi
done

while true
    do  
    hh deploy --network cronosTestnet --tags glcr
    if [ $? == 0 ]; then
        break
    fi
done

while true
    do  
    hh deploy --network cronosTestnet --tags boardroom
    if [ $? == 0 ]; then
        break
    fi
done

while true
    do  
    hh deploy --network cronosTestnet --tags lp
    if [ $? == 0 ]; then
        break
    fi
done

while true
    do  
    hh deploy --network cronosTestnet --tags SeigniorageOracle
    if [ $? == 0 ]; then
        break
    fi
done
while true
    do  
    hh deploy --network cronosTestnet --tags snowOracle
    if [ $? == 0 ]; then
        break
    fi
done
while true
    do  
    hh deploy --network cronosTestnet --tags glcrOracle
    if [ $? == 0 ]; then
        break
    fi
done
while true
    do  
    hh deploy --network cronosTestnet --tags usdcOracle
    if [ $? == 0 ]; then
        break
    fi
done
while true
    do  
    hh deploy --network cronosTestnet --tags treasury
    if [ $? == 0 ]; then
        break
    fi
done


while true
    do  
    hh deploy --network cronosTestnet --tags glcrRewardPool
    if [ $? == 0 ]; then
        break
    fi
done


while true
    do  
    hh deploy --network cronosTestnet --tags snowGenesisRewardPool
    if [ $? == 0 ]; then
        break
    fi
done
while true
    do  
    hh deploy --network cronosTestnet --tags snowNode
    if [ $? == 0 ]; then
        break
    fi
done
while true
    do  
    hh deploy --network cronosTestnet --tags glcrNode
    if [ $? == 0 ]; then
        break
    fi
done
while true
    do  
    hh deploy --network cronosTestnet --tags taxOffice
    if [ $? == 0 ]; then
        break
    fi
done
while true
    do  
    hh deploy --network cronosTestnet --tags wrappedRouter
    if [ $? == 0 ]; then
        break
    fi
done
while true
    do  
    hh deploy --network cronosTestnet --tags zap
    if [ $? == 0 ]; then
        break
    fi
done
while true
    do  
    hh deploy --network cronosTestnet --tags daoSnowRebateTreasury
    if [ $? == 0 ]; then
        break
    fi
done


while true
    do  
    hh deploy --network cronosTestnet --tags daoGlcrRebateTreasury
    if [ $? == 0 ]; then
        break
    fi
done
while true
    do  
    hh deploy --network cronosTestnet --tags devSnowRebateTreasury
    if [ $? == 0 ]; then
        break
    fi
done

while true
    do  
    hh deploy --network cronosTestnet --tags devGlcrRebateTreasury
    if [ $? == 0 ]; then
        break
    fi
done
