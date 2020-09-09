#!/usr/bin/env bash

#!/bin/bash
 function disable_v2ray()
{
	socks disable
	killall v2ray
}

function enable_v2ray()
{
	socks enable
	./run.sh client-prod &
}

case "$1" in
    start)
       enable_v2ray
    ;;
    stop)
        disable_v2ray
    ;;
	restart)
	disable_v2ray
	enable_v2ray
	;;
	status)
	ps -A | grep v2ray
	;;
    *)
        echo "usage: v2ray start/stop..."

esac
