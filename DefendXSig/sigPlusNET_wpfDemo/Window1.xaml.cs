using Microsoft.Win32;
using System.Drawing.Imaging;
using System.Windows;

namespace defendXSig
{
    /// <summary>
    /// Interaction logic for Window1.xaml
    /// </summary>
    public partial class Window1 : Window
    {
        public Window1()
        {
            InitializeComponent();
            sigPlusNET1.SetTabletState(1);
        }

        //private void cmdSign_Click(object sender, RoutedEventArgs e)
        //{
        //    sigPlusNET1.SetTabletState(1);
        //}

        private void cmdClear_Click(object sender, RoutedEventArgs e)
        {
            sigPlusNET1.ClearTablet();
        }

        private void cmdSigString_Click(object sender, RoutedEventArgs e)
        {
            if (sigPlusNET1.NumberOfTabletPoints() > 0)
            {
                sigPlusNET1.SetTabletState(0);

                sigPlusNET1.SetSigCompressionMode(1);

                SaveFileDialog dialog = new SaveFileDialog();
                dialog.Filter = "SIG Files (*.sig)|*.sig";
                if (dialog.ShowDialog() == true)
                {
                    sigPlusNET1.SetImageXSize(402);
                    sigPlusNET1.SetImageYSize(90);
                    sigPlusNET1.SetJustifyMode(5);
                    sigPlusNET1.GetSigImage().Save(dialog.FileName, ImageFormat.Png);
                    MessageBox.Show("Signature Saved Successfully", "Saved", MessageBoxButton.OK, MessageBoxImage.Information);
                    Application.Current.Shutdown();
                }
            }
            else
            {
                MessageBox.Show("Please sign first\n\nClick 'Sign' before signing", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
            sigPlusNET1.SetJustifyMode(0);
        }

        private void Window_Closing(object sender, System.ComponentModel.CancelEventArgs e)
        {
            sigPlusNET1.SetTabletState(0);
        }
    }
}
