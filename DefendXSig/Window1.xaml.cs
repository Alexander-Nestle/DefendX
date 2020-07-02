using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.IO;

namespace sigPlusNET_wpfDemo
{
    /// <summary>
    /// Interaction logic for Window1.xaml
    /// </summary>
    public partial class Window1 : Window
    {
        public Window1()
        {
            InitializeComponent();
        }

        private void cmdSign_Click(object sender, RoutedEventArgs e)
        {
            sigPlusNET1.SetTabletState(1);
        }

        private void cmdClear_Click(object sender, RoutedEventArgs e)
        {
            sigPlusNET1.ClearTablet();
            image1.Source = null;
        }

        private void cmdSigString_Click(object sender, RoutedEventArgs e)
        {
            if (sigPlusNET1.NumberOfTabletPoints() > 0)
            {
                sigPlusNET1.SetTabletState(0);

                // Encrypt the signature.
                sigPlusNET1.AutoKeyStart();
                sigPlusNET1.SetAutoKeyData("123");
                sigPlusNET1.AutoKeyFinish();
                sigPlusNET1.SetEncryptionMode(2);

                sigPlusNET1.SetSigCompressionMode(1);

                // This is the Topaz format SigString that can be stored for future use.
                MessageBox.Show("The SigString is \n\n" + sigPlusNET1.GetSigString());
            }
            else
            {
                MessageBox.Show("Please sign first.");
            }
        }

        private void Window_Closing(object sender, System.ComponentModel.CancelEventArgs e)
        {
            sigPlusNET1.SetTabletState(0);
        }

        private void dispatcherTimer_Tick(object sender, EventArgs e)
        {
            if (sigPlusNET1.NumberOfTabletPoints() > 0)
            {
                sigPlusNET1.SetImageXSize(500);
                sigPlusNET1.SetImageYSize(100);
                System.Drawing.Image myImg = sigPlusNET1.GetSigImage();

                MemoryStream ms = new MemoryStream();
                myImg.Save(ms, System.Drawing.Imaging.ImageFormat.Bmp);
                BitmapImage sigImg = new BitmapImage();
                sigImg.BeginInit();
                //sigImg.CacheOption = BitmapCacheOption.OnLoad;
                sigImg.StreamSource = ms;
                sigImg.EndInit();

                image1.Source = sigImg;
            }
        }

        private void Window_Loaded(object sender, RoutedEventArgs e)
        {
            // Create a timer

            System.Windows.Threading.DispatcherTimer dispatcherTimer = new System.Windows.Threading.DispatcherTimer();
            dispatcherTimer.Tick += new EventHandler(dispatcherTimer_Tick);
            dispatcherTimer.Interval = new TimeSpan(0, 0, 0, 0, 100);
            dispatcherTimer.Start();

            sigPlusNET1.SetImageXSize((int)image1.Width);
            sigPlusNET1.SetImageYSize((int)image1.Height);
        }
    }
}
