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

sudo apt-get install firewalld
sudo systemctl enable firewalld
sudo systemctl start firewalld

sudo firewall-cmd --zone=public --add-port=80/tcp --permanent
sudo firewall-cmd --zone=public --add-port=443/tcp --permanent
sudo firewall-cmd --zone=public --add-port=3000/tcp --permanent
sudo firewall-cmd --reload
# sudo firewall-cmd --list-all

sudo cp scripts/service/start_klog.sh /usr/bin/start_klog.sh
sudo chmod +x /usr/bin/start_klog.sh
sudo cp scripts/service/klog.service /etc/systemd/system/klog.service
sudo chmod 644 /etc/systemd/system/klog.service
sudo systemctl start klog
sudo systemctl enable klog
# sudo systemctl status klog

sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
sudo snap set certbot trust-plugin-with-root=ok
sudo snap install certbot-dns-cloudflare
sudo certbot certonly \
  --dns-cloudflare \
  --dns-cloudflare-credentials /home/ubuntu/klog_secret/token \
  -d klog.app \
  -d *.krrr.party
sudo certbot renew --dry-run