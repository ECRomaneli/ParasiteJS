#!/bin/sh

# APP NAME
APP_NAME=''

# LIBRARY PATH
LIB_PATH='./lib/'

# ORIG
TMP_PATH="${LIB_PATH}tmp/"

# DEST
WEB_PATH='./dist/web/'
WEB_TARGET='es5'

# Create module
if  [ "$1" != 'web' ]; then
    echo 'Building module...'
    tsc
fi

# Create web lib
if  [ "$1" != 'module' ]; then

    echo 'Building web library...'
    mkdir ${TMP_PATH}
    cp -f ${LIB_PATH}*.ts ${TMP_PATH}
    sed -i s/^export\\s//g ${TMP_PATH}*.ts
    if [ "$APP_NAME" == '' ]; then
        tsc ${TMP_PATH}*.ts --module none --target ${WEB_TARGET} --outDir ${WEB_PATH}
    else
        tsc ${TMP_PATH}*.ts --module none --target ${WEB_TARGET} --out ${WEB_PATH}${APP_NAME}.js
    fi
    rm -rf ${TMP_PATH}

    echo 'Minifying...'
    rm -f ${WEB_PATH}*.min.js
    for JS in ${WEB_PATH}*.js; do
        MIN_JS=$(echo $JS | sed s/.js/.min.js/g)
        uglifyjs --compress --mangle --output $MIN_JS -- $JS
    done
fi

echo 'Build finish!'


# read -n 1 -s -r -p ""