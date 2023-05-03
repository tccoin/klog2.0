sudo apt install python3-pip unzip
pip install gdown
echo 'PATH=$PATH:~/.local/bin' >> ~/.bashrc
# gdown xxxx

sudo apt-get update
sudo apt-get install \
    ca-certificates \
    curl \
    gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

sudo usermod -aG docker $USER

# sudo sysctl -w net.ipv4.ip_forward=1
# sudo iptables -t nat -A PREROUTING -p tcp --dport 443 -j REDIRECT --to-port 3000
# sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3000
# sudo iptables-save > /etc/iptables/rules.v4

sudo cp scripts/service/start_klog.sh /usr/bin/start_klog.sh
sudo chmod +x /usr/bin/start_klog.sh
sudo cp scripts/service/klog.service /etc/systemd/system/klog.service
sudo chmod 644 /etc/systemd/system/klog.service
sudo systemctl start klog
sudo systemctl enable klog
# sudo systemctl status klog