bc c -r build/build.zip build/*
ssh klog "rm -rf /root/klog2.0/build/*"
sftp -b scripts/sftp.txt klog
ssh klog "unzip /root/klog2.0/build/build.zip -d /root/klog2.0/build"