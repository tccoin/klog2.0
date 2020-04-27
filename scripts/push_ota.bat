bc c -r build/build.zip build/*
ssh klog "rm -rf /home/klog2.0/build/*"
sftp -b scripts/sftp.txt klog
ssh klog "unzip /home/klog2.0/build/build.zip -d /home/klog2.0/build"