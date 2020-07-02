using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace DefendX.API.Common.Utilities.CaC {
    public static class CacUtility {
        /// <summary>
        /// Get the current X509Certificate2 for the current user
        /// </summary>
        /// <returns>X509Certificate2 for current user</returns>
        public async static Task<X509Certificate2> GetUserCertificate (HttpContext context) {
 #if DEBUG
             //If In DEBUG mode

             X509Certificate2 clientCert = null;
             X509Store myClientStore = new X509Store ();
             myClientStore.Open (OpenFlags.ReadOnly);
             X509Certificate2Enumerator myClientEnum = myClientStore.Certificates.GetEnumerator ();

             //Get the first certificate that was loaded onto current computer
             while (myClientEnum.MoveNext ()) {
                 clientCert = myClientEnum.Current;
                 if (clientCert.Subject.Contains ("OU=PKI") && !clientCert.Subject.Contains("CN=DoD", StringComparison.OrdinalIgnoreCase)) {
                     break;
                 }
             }
             return clientCert;

 #else
            // Get current user certificate
            // X509Certificate2 cert = new
            // X509Certificate2 (System.Web.HttpContext.Current.Request.ClientCertificate.Certificate);
            return await context.Connection.GetClientCertificateAsync();

#endif
        }

        /// <summary>
        /// Returns the CACID of the current user
        /// </summary>
        /// <returns>CAC ID of current user</returns>
        // public static string GetUserLastName () {
        //     return GetLastNameFromCertificate (GetUserCertificate ());
        // }

        /// <summary>
        /// Returns the CACID of the current user
        /// </summary>
        /// <returns>CAC ID of current user</returns>
        // public static string GetUserEmail () {
        //     return GetX509Certificate ().ToString ();
        // }


        // public static X509Certificate GetX509Certificate () {
// #if DEBUG
//             //If In DEBUG mode

//             X509Certificate clientCert = null;
//             X509Store myClientStore = new X509Store ();
//             myClientStore.Open (OpenFlags.ReadOnly);
//             X509Certificate2Enumerator myClientEnum =
//                 myClientStore.Certificates.GetEnumerator ();

//             //Get the first certificate that was loaded onto current computer
//             while (myClientEnum.MoveNext ()) {
//                 clientCert = myClientEnum.Current;
//                 if (clientCert.Subject.Contains ("DOD EMAIL")) {
//                     break;
//                 }
//             }
//             return clientCert;

// #else
            //Get current user certificate
//             X509Certificate cert = new
//             X509Certificate (context.Current.Request.ClientCertificate.Certificate);
//             return cert;
// // #endif
        // }

        public static CaC GetCac(X509Certificate2 cert) {
            CaC cac = new CaC();
            string certSubject = cert.SubjectName.Name;
            var CNArray = certSubject.Split (',').First().Split(".");

            for (int i = 0; i < CNArray.Length; i++) 
            {
                if (i == 0) {
                    cac.LastName = CNArray[i].Replace("CN=", "");
                } else if (i == 1) {
                    cac.FirstName = CNArray[i];
                } else if (i == CNArray.Length - 1) {
                    long id; 
                    long.TryParse(CNArray[i], out id);
                    cac.DodId = id;
                } else {
                   cac.MiddleName += CNArray[i] + " ";
                }
            }
            return cac;
        }
    }
}