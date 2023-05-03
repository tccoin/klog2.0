iptables -t nat -A PREROUTING -p tcp --dport 443 -j REDIRECT --to-port 3000
iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3000
cd /home/ubuntu/klog_secret
nohup docker compose run -p 3000:3000 serve